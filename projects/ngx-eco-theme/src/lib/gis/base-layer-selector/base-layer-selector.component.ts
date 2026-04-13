import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';

@Component({
  selector: 'eco-base-layer-selector',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './base-layer-selector.component.html',
  styleUrls: ['./base-layer-selector.component.scss'],
})
export class BaseLayerSelectorComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  selectedLayer = input<'map' | 'satellite'>('map');
  layerChange = output<'map' | 'satellite'>();
  closeSelector = output<void>();

  selectLayer(layer: 'map' | 'satellite'): void {
    this.layerChange.emit(layer);
  }

  onClose(): void {
    this.closeSelector.emit();
  }
}
