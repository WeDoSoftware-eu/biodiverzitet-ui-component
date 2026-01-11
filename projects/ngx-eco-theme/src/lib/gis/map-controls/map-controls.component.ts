import { Component, input, output, signal } from '@angular/core';
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
  homeViewClick = output<void>();

  // Click feedback states
  zoomInClicked = signal(false);
  zoomOutClicked = signal(false);
  homeViewClicked = signal(false);

  onZoomIn(): void {
    this.triggerClickFeedback(this.zoomInClicked);
    this.zoomIn.emit();
  }

  onZoomOut(): void {
    this.triggerClickFeedback(this.zoomOutClicked);
    this.zoomOut.emit();
  }

  onFullscreen(): void {
    this.fullscreen.emit();
  }

  onHomeViewClick(): void {
    this.triggerClickFeedback(this.homeViewClicked);
    this.homeViewClick.emit();
  }

  private triggerClickFeedback(clickedSignal: ReturnType<typeof signal<boolean>>): void {
    clickedSignal.set(true);
    setTimeout(() => clickedSignal.set(false), 1000);
  }
}
