import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';
import { UtmLegendItem } from './utm-legend.model';

@Component({
  selector: 'eco-utm-legend',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './utm-legend.component.html',
  styleUrls: ['./utm-legend.component.scss'],
})
export class UtmLegendComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  items = input<UtmLegendItem[]>([]);
  title = input<string>('');

  closeSelector = output<void>();

  onClose(): void {
    this.closeSelector.emit();
  }
}
