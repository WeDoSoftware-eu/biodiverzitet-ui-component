import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'eco-map-controls',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss'],
})
export class MapControlsComponent {
  zoomLevel = input<string | number>('100%');

  zoomIn = output<void>();
  zoomOut = output<void>();
  fullscreen = output<void>();
  homeViewClick = output<void>();

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
