import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';
import { LegendColorChangeEvent, LegendDisplayMode, LegendItem } from './legend.model';

@Component({
  selector: 'eco-legend-selector',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './legend-selector.component.html',
  styleUrls: ['./legend-selector.component.scss'],
})
export class LegendSelectorComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  items = input<LegendItem[]>([]);
  title = input<string>('');
  mode = input<LegendDisplayMode>('basic');
  showModeToggle = input<boolean>(false);
  modeBasicLabel = input<string>('');
  modeAdvancedLabel = input<string>('');

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
