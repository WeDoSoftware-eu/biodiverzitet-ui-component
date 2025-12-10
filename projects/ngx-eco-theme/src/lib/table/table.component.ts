import { Component, input, output, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableColumn, TableAction, TableConfig, ServerSideEvent } from './table.model';

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
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> {
  config = input.required<TableConfig<T>>();
  data = input<T[]>([]);

  readonly displayedColumns = computed(() =>
    this.config().columns.map(col => col.key)
  );


  readonly dataSource = computed(() => new MatTableDataSource<T>(this.data() || []));

  getColumnValue(row: T, column: TableColumn<T>): any {
    const keys = column.key.split('.');
    let value: any = row;

    for (const key of keys) {
      value = value?.[key];
    }

    return value;
  }

  getBadgeClass(row: T, column: TableColumn<T>): string {
    return column.badgeConfig?.getClass ? column.badgeConfig.getClass(row) : '';
  }

  getBadgeValue(row: T, column: TableColumn<T>): string {
    return column.badgeConfig?.getValue ? column.badgeConfig.getValue(row) : this.getColumnValue(row, column);
  }

  shouldShowAction(row: T, action: TableAction<T>): boolean {
    return action.show ? action.show(row) : true;
  }

  onActionClick(row: T, action: TableAction<T>, event: Event): void {
    event.stopPropagation();
    action.onClick(row);
  }

  get emptyMessage(): string {
    return this.config().emptyMessage || 'Нема података за приказ';
  }

  get isLoading(): boolean {
    return this.config().loading || false;
  }
}
