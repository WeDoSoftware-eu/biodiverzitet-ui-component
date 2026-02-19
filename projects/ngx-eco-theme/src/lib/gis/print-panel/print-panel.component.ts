import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Orientation, PaperSize, PrintDpi, PrintScale, PrintSettings } from './print-panel.model';

@Component({
  selector: 'eco-print-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-panel.component.html',
  styleUrls: ['./print-panel.component.scss'],
})
export class PrintPanelComponent {
  title = input<string>('Штампа');
  closePanel = output<void>();
  print = output<PrintSettings>();
  settingsChanged = output<PrintSettings>();

  selectedPaperSize = signal<PaperSize>('A4');
  selectedOrientation = signal<Orientation>('portrait');
  selectedScale = signal<PrintScale>('1:1000');
  selectedDpi = signal<PrintDpi>(96);

  paperSizes: PaperSize[] = ['A4', 'A3'];

  orientations: { value: Orientation; label: string }[] = [
    { value: 'portrait', label: 'Портрет' },
    { value: 'landscape', label: 'Пејзаж' },
  ];

  scales: PrintScale[] = ['1:500', '1:1000', '1:2500', '1:5000', '1:10000', '1:25000'];

  dpiOptions: PrintDpi[] = [96, 150, 300];

  onClose(): void {
    this.closePanel.emit();
  }

  onPaperSizeChange(size: PaperSize): void {
    this.selectedPaperSize.set(size);
    this.emitSettingsChanged();
  }

  onOrientationChange(orientation: Orientation): void {
    this.selectedOrientation.set(orientation);
    this.emitSettingsChanged();
  }

  onScaleChange(scale: PrintScale): void {
    this.selectedScale.set(scale);
    this.emitSettingsChanged();
  }

  onDpiChange(dpi: number): void {
    this.selectedDpi.set(dpi as PrintDpi);
    this.emitSettingsChanged();
  }

  onPrint(): void {
    this.print.emit({
      paperSize: this.selectedPaperSize(),
      orientation: this.selectedOrientation(),
      scale: this.selectedScale(),
      dpi: this.selectedDpi(),
    });
  }

  private emitSettingsChanged(): void {
    this.settingsChanged.emit({
      paperSize: this.selectedPaperSize(),
      orientation: this.selectedOrientation(),
      scale: this.selectedScale(),
      dpi: this.selectedDpi(),
    });
  }
}
