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
  colorChange = output<{ layerId: string; color: string }>();
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

  onColorChange(layerId: string, color: string): void {
    this.colorChange.emit({ layerId, color });
  }

  shouldShowColorPicker(layer: MapLayer): boolean {
    return layer.isColorCustomizable === true || !!layer.color;
  }

  getLayerDisplayColor(layer: MapLayer): string {
    return layer.color ?? '#808080';
  }

  getLayerPickerValue(layer: MapLayer): string {
    return this.toHexColor(layer.color);
  }

  getColorPickerId(layerId: string): string {
    return `layer-color-${layerId}`;
  }

  private toHexColor(color: string | undefined): string {
    if (!color) return '#808080';

    const normalized = color.trim();
    if (normalized.startsWith('#')) {
      if (normalized.length === 4) {
        const r = normalized[1];
        const g = normalized[2];
        const b = normalized[3];
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
      }
      return normalized.slice(0, 7).toLowerCase();
    }

    const rgbMatch = normalized.match(/rgba?\(([^)]+)\)/i);
    if (!rgbMatch) return '#808080';

    const rgbValues = rgbMatch[1]
      .split(',')
      .slice(0, 3)
      .map(value => Number.parseInt(value.trim(), 10));

    if (rgbValues.length !== 3 || rgbValues.some(value => Number.isNaN(value))) {
      return '#808080';
    }

    return `#${rgbValues.map(value => value.toString(16).padStart(2, '0')).join('')}`;
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
