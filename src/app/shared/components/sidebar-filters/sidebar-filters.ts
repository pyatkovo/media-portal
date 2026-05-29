import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-filters',
  imports: [CommonModule],
  templateUrl: './sidebar-filters.html',
  styleUrl: './sidebar-filters.scss',
  standalone: true,
})
export class SidebarFilters {
  sportOptions = [
    { id: 'all', label: 'Все', count: 56 },
    { id: 'hockey', label: 'Хоккей', count: 23 },
    { id: 'football', label: 'Футбол', count: 67 },
  ];

  tagOptions = [
    { id: 'training', label: 'Тренировка', count: 23 },
    { id: 'game', label: 'Игра', count: 17 },
    { id: 'tournament', label: 'Турнир', count: 9 },
    { id: 'champ', label: 'Чемпионат', count: 13 },
  ];

  isSportOpen = false;
  isTagOpen = false;
  selectedSport = this.sportOptions[0];
  selectedTagIds: string[] = [];
  searchValue = '';

  toggleSport(): void {
    this.isTagOpen = false;
    this.isSportOpen = !this.isSportOpen;
  }

  selectSport(option: typeof this.sportOptions[number]): void {
    this.selectedSport = option;
  }

  saveSport(): void {
    this.isSportOpen = false;
  }

  toggleTag(): void {
    this.isSportOpen = false;
    this.isTagOpen = !this.isTagOpen;
  }

  toggleTagOption(option: typeof this.tagOptions[number]): void {
    const hasOption = this.selectedTagIds.includes(option.id);

    if (hasOption) {
      this.selectedTagIds = this.selectedTagIds.filter((id) => id !== option.id);
      return;
    }

    this.selectedTagIds = [...this.selectedTagIds, option.id];
  }

  saveTag(): void {
    this.isTagOpen = false;
  }

  onSearchInput(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value;
  }

  clearSearch(): void {
    this.searchValue = '';
  }

  isTagSelected(optionId: string): boolean {
    return this.selectedTagIds.includes(optionId);
  }

  clearSelectedTags(): void {
    this.selectedTagIds = [];
  }

  removeSelectedTag(tagId: string): void {
    this.selectedTagIds = this.selectedTagIds.filter((id) => id !== tagId);
  }

  get selectedTags() {
    return this.tagOptions.filter(option =>
      this.selectedTagIds.includes(option.id)
    );
  }

  get selectedTagsLabel(): string {
    if (!this.selectedTags.length) {
      return 'Выбрать теги';
    }
    if (this.selectedTags.length === 1) {
      return this.selectedTags[0].label;
    }

    return `${this.selectedTags[this.selectedTags.length-1].label}`;
  }
  get selectedTagCount(): number | null {
    const lastSelectedTagId = this.selectedTagIds[this.selectedTagIds.length - 1];

    const tag = this.tagOptions.find(option => option.id === lastSelectedTagId);

    return tag ? tag.count : null;
  }
}
