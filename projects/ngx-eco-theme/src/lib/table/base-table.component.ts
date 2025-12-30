import { Directive, inject, OnDestroy, signal } from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { TableFilterStoreService } from './table-filter/table-filter-store';
import { FilterEvent, TableConfig } from './table.model';

export type FilterValue = string | number | boolean | string[] | number[] | null | undefined;
export type BaseFilter = Record<string, FilterValue>;

@Directive()
export abstract class BaseTableComponent<
  T,
  TFilter extends BaseFilter = BaseFilter,
> implements OnDestroy {
  protected filterStore = inject(TableFilterStoreService);

  tableData = signal<T[]>([]);
  totalItems = signal<number>(0);
  tableConfig = signal<TableConfig<T>>({ columns: [], loading: false });

  currentPageIndex = signal(0);
  currentPageSize = signal(10);

  protected queryParams$$ = new Subject<FilterEvent>();
  public destroy$$ = new Subject<void>();

  protected abstract get filterStoreKey(): string;
  protected abstract initTableConfig(): void;
  protected abstract fetchData(filterBody: FilterEvent & TFilter): void;

  constructor() {
    this.queryParams$$.pipe(debounceTime(50), takeUntil(this.destroy$$)).subscribe(event => {
      this.loadData(event);
    });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
    this.emitQueryParams();
  }

  protected emitQueryParams(): void {
    const event: FilterEvent = {
      pageIndex: this.currentPageIndex(),
      pageSize: this.currentPageSize(),
    };
    this.queryParams$$.next(event);
  }

  loadData(event: FilterEvent): void {
    this.tableConfig.update(config => ({ ...config, loading: true }));

    const filter = this.filterStore.get<TFilter>(this.filterStoreKey)();

    const filterBody: FilterEvent & TFilter = {
      ...event,
      ...filter,
    };

    this.fetchData(filterBody);
  }

  onFilter(_value?: unknown): void {
    this.emitQueryParams();
  }

  protected setTableData(items: T[], totalCount: number): void {
    this.tableData.set(items);
    this.totalItems.set(totalCount);
    this.tableConfig.update(config => ({ ...config, loading: false }));

    this.adjustPaginationIfNeeded(totalCount);
  }

  private adjustPaginationIfNeeded(totalCount: number): void {
    const totalPages = Math.ceil(totalCount / this.currentPageSize());
    const currentPage = this.currentPageIndex();

    if (currentPage >= totalPages && totalPages > 0) {
      this.currentPageIndex.set(totalPages - 1);
      this.emitQueryParams();
    }
  }

  protected handleError(err: unknown): void {
    console.error('Error loading data:', err);
    this.tableConfig.update(config => ({ ...config, loading: false }));
  }
}
