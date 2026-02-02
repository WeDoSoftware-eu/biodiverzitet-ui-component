import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-legend-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend-button.component.html',
  styleUrls: ['./legend-button.component.scss'],
})
export class LegendButtonComponent {
  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
