import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-legend-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend-button.component.html',
  styleUrls: ['./legend-button.component.scss'],
})
export class LegendButtonComponent {
  @Input() isActive = false;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
