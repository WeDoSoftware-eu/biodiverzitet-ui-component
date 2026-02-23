import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MapLayer, MapLayerGroup } from '../layers-selector/layer.model';

@Component({
  selector: 'eco-utm-layers-selector',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './utm-layers-selector.component.html',
  styleUrls: ['./utm-layers-selector.component.scss'],
})
export class UtmLayersSelectorComponent {
  // Inputs
  groups = input<MapLayerGroup[]>([]);
  title = input<string>('Филтери');
  showAllLabel = input<string>('Прикажи све');

  // State
  groupSearchTexts = signal<Record<string, string>>({});
  expandedGroups = signal<Set<string>>(new Set());

  // Outputs
  layerToggle = output<MapLayer>();
  groupToggleAll = output<{ groupId: string; selectAll: boolean }>();
  closeSelector = output<void>();

  // Computed
  filteredGroups = computed(() => {
    const searchTexts = this.groupSearchTexts();
    const allGroups = this.groups();

    return allGroups.map(group => {
      const search = (searchTexts[group.id] || '').toLowerCase().trim();
      if (!search) {
        return group;
      }
      return {
        ...group,
        layers: group.layers.filter(layer => layer.name.toLowerCase().includes(search)),
      };
    });
  });

  onLayerToggle(layer: MapLayer): void {
    this.layerToggle.emit({
      ...layer,
      visible: !layer.visible,
    });
  }

  onClose(): void {
    this.closeSelector.emit();
  }

  onGroupSearchInput(groupId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.groupSearchTexts.update(current => ({
      ...current,
      [groupId]: input.value,
    }));
  }

  clearGroupSearch(groupId: string): void {
    this.groupSearchTexts.update(current => ({
      ...current,
      [groupId]: '',
    }));
  }

  getGroupSearchText(groupId: string): string {
    return this.groupSearchTexts()[groupId] || '';
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
    const searchText = (this.groupSearchTexts()[groupId] || '').trim();
    if (searchText) {
      return true;
    }
    return this.expandedGroups().has(groupId);
  }

  isAllSelected(group: MapLayerGroup): boolean {
    return group.layers.length > 0 && group.layers.every(l => l.visible);
  }

  onToggleAll(group: MapLayerGroup): void {
    const allSelected = this.isAllSelected(group);
    this.groupToggleAll.emit({ groupId: group.id, selectAll: !allSelected });
  }
}
