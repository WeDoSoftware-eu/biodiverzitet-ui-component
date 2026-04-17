import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';
import { HoverTooltipData } from './hover-tooltip.model';

@Component({
  selector: 'eco-hover-tooltip',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './hover-tooltip.component.html',
  styleUrls: ['./hover-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverTooltipComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  data = input<HoverTooltipData | null>(null);
}
