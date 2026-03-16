import { Observable } from 'rxjs';
import { EcoIcon } from '../icon/icon.component';

export interface TableColumn<T> {
  key: string;
  label: Observable<string>;
  tooltip?: Observable<string>;
  type?: 'text' | 'badge' | 'date' | 'actions' | 'number' | 'enum' | 'icon';
  width?: string;
  align?: 'left' | 'center' | 'right';
  pipe?: 'date' | 'number';
  pipeFormat?: string;
  valuePrepareFunction?: (key: string, row: T) => unknown;
  badgeConfig?: {
    getValue: (row: T) => string;
    getClass: (row: T) => string;
    getIcon?: (row: T) => EcoIcon;
  };
  iconConfig?: {
    getClass: (row: T) => 'error' | 'success';
    getIcon: (row: T) => EcoIcon;
  };
  actions?: TableAction<T>[];
}

export interface TableAction<T> {
  icon: EcoIcon;
  tooltip?: Observable<string>;
  color?: string;
  show?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: Observable<string>;
}

export interface FilterEvent {
  pageIndex: number;
  pageSize: number;
}

export interface ProcessedAction<T> extends TableAction<T> {
  visible: boolean;
}

export interface ProcessedCellValue<T> {
  raw: unknown;
  badge: {
    class: string;
    value: unknown;
  } | null;
  actions: ProcessedAction<T>[] | null;
}

export type ProcessedRow<T> = {
  _original: T;
  _isSelected: boolean;
  [key: string]: ProcessedCellValue<T> | T | boolean;
};
