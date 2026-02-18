import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtmLegendItem } from './utm-legend.model';

@Component({
  selector: 'eco-utm-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utm-legend.component.html',
  styleUrls: ['./utm-legend.component.scss'],
})
export class UtmLegendComponent {
  items = input<UtmLegendItem[]>([]);
  title = input<string>('Легенда');

  closeSelector = output<void>();

  onClose(): void {
    this.closeSelector.emit();
  }
}
