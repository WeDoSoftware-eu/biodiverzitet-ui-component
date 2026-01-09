import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-map-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss'],
})
export class MapControlsComponent {
  // Inputs
  zoomLevel = input<string | number>('100%');

  // Outputs za akcije
  zoomIn = output<void>();
  zoomOut = output<void>();
  fullscreen = output<void>();
  infoClick = output<void>();

  onZoomIn(): void {
    this.zoomIn.emit();
  }

  onZoomOut(): void {
    this.zoomOut.emit();
  }

  onFullscreen(): void {
    this.fullscreen.emit();
  }

  onInfoClick(): void {
    this.infoClick.emit();
  }
}
