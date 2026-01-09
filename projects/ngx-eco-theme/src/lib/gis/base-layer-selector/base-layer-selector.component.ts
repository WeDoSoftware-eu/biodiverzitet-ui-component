import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-base-layer-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-layer-selector.component.html',
  styleUrls: ['./base-layer-selector.component.scss'],
})
export class BaseLayerSelectorComponent {
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
