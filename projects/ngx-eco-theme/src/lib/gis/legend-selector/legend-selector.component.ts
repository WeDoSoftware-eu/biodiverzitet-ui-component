import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { LegendColorChangeEvent, LegendDisplayMode, LegendItem } from './legend.model';

@Component({
  selector: 'eco-legend-selector',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './legend-selector.component.html',
  styleUrls: ['./legend-selector.component.scss'],
})
export class LegendSelectorComponent {
  items = input<LegendItem[]>([]);
  title = input<string>('Легенда');
  mode = input<LegendDisplayMode>('basic');
  showModeToggle = input<boolean>(false);
  modeBasicLabel = input<string>('Основни');
  modeAdvancedLabel = input<string>('Напредни');

  closeSelector = output<void>();
  modeChange = output<LegendDisplayMode>();
  itemColorChange = output<LegendColorChangeEvent>();

  onClose(): void {
    this.closeSelector.emit();
  }

  onModeSelect(mode: LegendDisplayMode): void {
    if (this.mode() === mode) {
      return;
    }

    this.modeChange.emit(mode);
  }

  isColorEditable(item: LegendItem): boolean {
    return this.mode() === 'advanced' && !!item.colorEditable && !!item.colorKey;
  }

  getColorValue(item: LegendItem): string {
    return item.colorValue || item.strokeColor || item.color || '#000000';
  }

  onColorChange(item: LegendItem, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!item.colorKey || !target?.value) {
      return;
    }

    this.itemColorChange.emit({
      key: item.colorKey,
      color: target.value,
    });
  }

  trackByItemId(index: number, item: LegendItem): string {
    return item.id;
  }
}
