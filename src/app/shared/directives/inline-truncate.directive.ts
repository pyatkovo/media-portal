import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appInlineTruncate]',
  standalone: true,
})
export class InlineTruncateDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('appInlineTruncate') text = '';
  @Input() truncateMaxHeight = 96;
  @Input() truncateSuffix = '...';

  private textElement: HTMLElement | null = null;
  private resizeObserver?: ResizeObserver;
  private rafId?: number;
  private viewInitialized = false;

  constructor(
    private readonly hostRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.textElement = this.hostRef.nativeElement.querySelector('[data-truncate-text]');

    this.scheduleRecalculate();
    this.observeResize();
    this.recalculateAfterFontsReady();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewInitialized) {
      return;
    }

    if (changes['text'] || changes['truncateMaxHeight'] || changes['truncateSuffix']) {
      this.scheduleRecalculate();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();

    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  private observeResize(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.scheduleRecalculate());
    this.resizeObserver.observe(this.hostRef.nativeElement);
  }

  private recalculateAfterFontsReady(): void {
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;

    if (!fonts?.ready) {
      return;
    }

    fonts.ready
      .then(() => this.scheduleRecalculate())
      .catch(() => {
        // Ignore font loading errors; current truncation remains usable.
      });
  }

  private scheduleRecalculate(): void {
    this.zone.runOutsideAngular(() => {
      if (this.rafId !== undefined) {
        cancelAnimationFrame(this.rafId);
      }

      this.rafId = requestAnimationFrame(() => {
        this.rafId = undefined;
        this.recalculate();
      });
    });
  }

  private recalculate(): void {
    const hostElement = this.hostRef.nativeElement;
    if (!this.textElement) {
      return;
    }

    const sourceText = (this.text ?? '').trim();
    this.setText(sourceText);

    if (!sourceText || hostElement.scrollHeight <= this.truncateMaxHeight) {
      return;
    }

    let left = 0;
    let right = sourceText.length;
    let bestFit = '';

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const candidate = `${sourceText.slice(0, mid).trimEnd()}${this.truncateSuffix}`;
      this.setText(candidate);

      if (hostElement.scrollHeight <= this.truncateMaxHeight) {
        bestFit = candidate;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    this.setText(bestFit || this.truncateSuffix);
  }

  private setText(value: string): void {
    if (!this.textElement) {
      return;
    }

    this.renderer.setProperty(this.textElement, 'textContent', value);
  }
}
