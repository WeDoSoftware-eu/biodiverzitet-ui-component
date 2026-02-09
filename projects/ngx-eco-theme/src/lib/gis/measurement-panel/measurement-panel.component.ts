import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementItem, MeasurementType } from './measurement.model';

@Component({
  selector: 'eco-measurement-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './measurement-panel.component.html',
  styleUrls: ['./measurement-panel.component.scss'],
})
export class MeasurementPanelComponent {
  title = input<string>('Мерење');
  measurements = input<MeasurementItem[]>([]);
  activeTab = input<MeasurementType>('point');
  isDrawing = input<boolean>(false);

  closePanel = output<void>();
  tabChange = output<MeasurementType>();
  deleteMeasurement = output<number>();
  addNew = output<void>();
  stopDrawing = output<void>();

  tabs: { type: MeasurementType; label: string }[] = [
    { type: 'point', label: 'Тачка' },
    { type: 'line', label: 'Линија' },
    { type: 'polygon', label: 'Полигон' },
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
