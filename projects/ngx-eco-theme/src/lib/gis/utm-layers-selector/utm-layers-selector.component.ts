import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';
import { MapLayer, MapLayerGroup } from '../layers-selector/layer.model';
import { normalizeForSearch } from '../../searchable-select/sr-transliterate';

@Component({
  selector: 'eco-utm-layers-selector',
  standalone: true,
  imports: [AsyncPipe, MatTooltipModule, IconComponent],
  templateUrl: './utm-layers-selector.component.html',
  styleUrls: ['./utm-layers-selector.component.scss'],
})
export class UtmLayersSelectorComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  // Inputs
  groups = input<MapLayerGroup[]>([]);
  title = input<string>('');
  showAllLabel = input<string>('');

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
      const search = normalizeForSearch((searchTexts[group.id] || '').trim());
      if (!search) {
        return group;
      }
      return {
        ...group,
        layers: group.layers.filter(layer => normalizeForSearch(layer.name).includes(search)),
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
