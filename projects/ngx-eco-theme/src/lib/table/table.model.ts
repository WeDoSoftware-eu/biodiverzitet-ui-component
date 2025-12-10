export interface TableColumn<T> {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'actions';
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
  icon: string;
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

export interface ServerSideEvent {
  pageIndex: number;
  pageSize: number;
  searchText: string;
}
