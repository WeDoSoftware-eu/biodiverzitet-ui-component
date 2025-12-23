import { EcoIcon } from '../icon/icon.component';

export interface TableColumn<T> {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'actions' | 'number' | 'enum';
  width?: string;
  align?: 'left' | 'center' | 'right';
  pipe?: 'date' | 'number';
  pipeFormat?: string;
  badgeConfig?: {
    getValue: (row: T) => string;
    getClass: (row: T) => string;
  };
  actions?: TableAction<T>[];
}

export interface TableAction<T> {
  icon: EcoIcon;
  tooltip?: string;
  color?: string;
  show?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

export interface FilterEvent {
  pageIndex: number;
  pageSize: number;
  searchText: string;
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
  [key: string]: ProcessedCellValue<T> | T;
};
