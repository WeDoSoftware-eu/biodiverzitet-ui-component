import { Component, inject, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';
import { MapLayer, MapLayerGroup } from './layer.model';

@Component({
  selector: 'eco-layers-selector',
  standalone: true,
  imports: [AsyncPipe, MatTooltipModule, IconComponent],
  templateUrl: './layers-selector.component.html',
  styleUrls: ['./layers-selector.component.scss'],
})
export class LayersSelectorComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  // Inputs
  layers = input<MapLayer[]>([]);
  groups = input<MapLayerGroup[]>([]);
  title = input<string>('');

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
