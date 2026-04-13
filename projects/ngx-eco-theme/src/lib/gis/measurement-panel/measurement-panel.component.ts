import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';
import { MeasurementItem, MeasurementType } from './measurement.model';

@Component({
  selector: 'eco-measurement-panel',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './measurement-panel.component.html',
  styleUrls: ['./measurement-panel.component.scss'],
})
export class MeasurementPanelComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  title = input<string>('');
  measurements = input<MeasurementItem[]>([]);
  activeTab = input<MeasurementType>('point');
  isDrawing = input<boolean>(false);

  closePanel = output<void>();
  tabChange = output<MeasurementType>();
  deleteMeasurement = output<number>();
  addNew = output<void>();
  stopDrawing = output<void>();

  tabs: { type: MeasurementType; i18nKey: 'point' | 'line' | 'polygon' }[] = [
    { type: 'point', i18nKey: 'point' },
    { type: 'line', i18nKey: 'line' },
    { type: 'polygon', i18nKey: 'polygon' },
  ];

  onClose(): void {
    this.closePanel.emit();
  }

  onTabChange(type: MeasurementType): void {
    this.tabChange.emit(type);
  }

  onDelete(id: number): void {
    this.deleteMeasurement.emit(id);
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  onStopDrawing(): void {
    this.stopDrawing.emit();
  }

  trackByItemId(index: number, item: MeasurementItem): number {
    return item.id;
  }

  get filteredMeasurements(): MeasurementItem[] {
    return this.measurements().filter(m => m.type === this.activeTab());
  }
}
