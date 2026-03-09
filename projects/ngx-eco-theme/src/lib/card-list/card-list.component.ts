import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CardListConfig, CardAction, CardSeverity, ProcessedCard } from './card-list.model';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { ChipComponent } from '../chip/chip.component';
import { EcoIcon, IconComponent } from '../icon/icon.component';
import { Observable } from 'rxjs';

interface WithId {
  id: string | number;
}
function hasId(obj: unknown): obj is WithId {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

const SEVERITY_ICON_MAP: Record<CardSeverity, EcoIcon> = {
  warning: 'warrning',
  blocked: 'delete',
};

@Component({
  selector: 'eco-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ChipComponent,
    IconComponent,
  ],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent<T> {
  private i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  config = input.required<CardListConfig<T>>();
  data = input<T[]>([]);
  selectRowEvent = input<boolean>(false);

  selectRowAction = output<{ _original: T }>();

  selectedRow = signal<{ _original: T } | null>(null);

  readonly selectedRowId = computed(() => {
    const selected = this.selectedRow();
    if (!selected) return null;
    return hasId(selected._original) ? selected._original.id : null;
  });

  readonly processedCards = computed((): ProcessedCard<T>[] => {
    const rows = this.data() ?? [];
    const cfg = this.config();
    const selectedId = this.selectedRowId();

    return rows.map((row): ProcessedCard<T> => {
      const rowId = hasId(row) ? row.id : null;
      const severity = cfg.getSeverity ? cfg.getSeverity(row) : 'none';

      return {
        _original: row,
        _isSelected: selectedId !== null && rowId === selectedId,

        title: cfg.getTitle(row),
        description: cfg.getDescription ? cfg.getDescription(row) : null,
        severity,
        severityIcon: severity !== 'none' ? SEVERITY_ICON_MAP[severity] : null,

        badges: (cfg.badges ?? []).map(b => ({
          value: b.getValue(row),
          cssClass: b.getClass(row),
          icon: b.getIcon ? b.getIcon(row) : undefined,
          visible: b.show ? b.show(row) : true,
        })),

        meta: (cfg.meta ?? []).map(m => ({
          icon: m.icon,
          label: m.label,
          value: m.getValue(row),
          visible: m.show ? m.show(row) : true,
        })),

        actions: (cfg.actions ?? []).map(a => ({
          ...a,
          visible: a.show ? a.show(row) : true,
        })),
      };
    });
  });

  get isLoading(): boolean {
    return this.config().loading ?? false;
  }

  get emptyMessage(): Observable<string> {
    return this.config().emptyMessage ?? this.i18n.table.noData;
  }

  onActionClick(card: ProcessedCard<T>, action: CardAction<T>, event: Event): void {
    event.stopPropagation();
    action.onClick(card._original);
  }

  rowClick(card: ProcessedCard<T>): void {
    if (!this.config().selectable) return;
    const ref = { _original: card._original };
    this.selectedRow.set(ref);
    this.selectRowAction.emit(ref);
  }
}
