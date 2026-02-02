import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MapLayer, MapLayerGroup } from './layer.model';

@Component({
  selector: 'eco-layers-selector',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './layers-selector.component.html',
  styleUrls: ['./layers-selector.component.scss'],
})
export class LayersSelectorComponent {
  // Inputs
  layers = input<MapLayer[]>([]);
  groups = input<MapLayerGroup[]>([]);
  title = input<string>('Слојеви');

  // State
  expandedGroups = signal<Set<string>>(new Set());

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

  toggleGroupExpanded(groupId: string): void {
    const current = this.expandedGroups();
    const updated = new Set(current);
    if (updated.has(groupId)) {
      updated.delete(groupId);
    } else {
      updated.add(groupId);
    }
    this.expandedGroups.set(updated);
  }

  isGroupExpanded(groupId: string): boolean {
    return this.expandedGroups().has(groupId);
  }
}
