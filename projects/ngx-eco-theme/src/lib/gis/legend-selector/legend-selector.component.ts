import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendItem } from './legend.model';

@Component({
  selector: 'eco-legend-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend-selector.component.html',
  styleUrls: ['./legend-selector.component.scss'],
})
export class LegendSelectorComponent {
  items = input<LegendItem[]>([]);
  title = input<string>('Легенда');

  closeSelector = output<void>();

  onClose(): void {
    this.closeSelector.emit();
  }

  trackByItemId(index: number, item: LegendItem): string {
    return item.id;
  }
}
