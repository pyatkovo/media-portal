import { Component } from '@angular/core';
import { MediaCard } from '../../shared/components/media-card/media-card';
import { SidebarFilters } from '../../shared/components/sidebar-filters/sidebar-filters';

@Component({
  selector: 'app-media-page',
  imports: [SidebarFilters, MediaCard],
  templateUrl: './media-page.html',
  styleUrl: './media-page.scss',
})
export class MediaPage {

}
