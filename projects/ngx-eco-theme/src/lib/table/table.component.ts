import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  TableColumn,
  TableAction,
  TableConfig,
  ProcessedRow,
  ProcessedAction,
  ProcessedCellValue,
} from './table.model';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'eco-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ChipComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> {
  private i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  config = input.required<TableConfig<T>>();
  data = input<T[]>([]);

  readonly displayedColumns = computed(() => this.config().columns.map(col => col.key));

  readonly dataSource = computed(() => new MatTableDataSource<T>(this.data() || []));

  readonly processedData = computed((): ProcessedRow<T>[] => {
    const rows: T[] = this.data() || [];
    const columns = this.config().columns as TableColumn<T>[];

    return rows.map((row: T) => {
      const processedRow: ProcessedRow<T> = {
        _original: row,
      } as ProcessedRow<T>;

      columns.forEach(column => {
        const value = this.getColumnValue(row, column);

        processedRow[column.key] = {
          raw: value,
          badge:
            column.type === 'badge'
              ? {
                  class: column.badgeConfig?.getClass ? column.badgeConfig.getClass(row) : '',
                  value: column.badgeConfig?.getValue ? column.badgeConfig.getValue(row) : value,
                }
              : null,

          actions:
            column.type === 'actions' && column.actions
              ? column.actions.map(
                  action =>
                    ({
                      ...action,
                      visible: action.show ? action.show(row) : true,
                    }) as ProcessedAction<T>
                )
              : null,
        } as ProcessedCellValue<T>;
      });

      return processedRow;
    });
  });

  private getColumnValue(row: T, column: TableColumn<T>): any {
    const keys = column.key.split('.');
    let value: any = row;

    for (const key of keys) {
      value = value?.[key];
    }

    return value;
  }

  onActionClick(row: any, action: TableAction<T>, event: Event): void {
    event.stopPropagation();
    action.onClick(row._original);
  }

  get emptyMessage(): string {
    return this.config().emptyMessage || `${this.i18n.table.noData}`;
  }

  get isLoading(): boolean {
    return this.config().loading || false;
  }
}
