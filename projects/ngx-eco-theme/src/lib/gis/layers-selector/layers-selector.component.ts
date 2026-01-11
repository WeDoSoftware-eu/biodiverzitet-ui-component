import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayer } from './layer.model';

@Component({
  selector: 'eco-layers-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layers-selector.component.html',
  styleUrls: ['./layers-selector.component.scss'],
})
export class LayersSelectorComponent {
  // Inputs
  layers = input<MapLayer[]>([]);
  title = input<string>('Слојеви');

  // Outputs
  layerToggle = output<MapLayer>();
  closeSelector = output<void>();

  onLayerToggle(layer: MapLayer): void {
    this.layerToggle.emit({
      ...layer,
      visible: !layer.visible,
    });
  }

  onClose(): void {
    this.closeSelector.emit();
  }

  trackByLayerId(index: number, layer: MapLayer): string {
    return layer.id;
  }
}
