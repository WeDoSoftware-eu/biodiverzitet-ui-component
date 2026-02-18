import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  BACK_ROUTES,
  ChipComponent,
  ECO_ICONS,
  FilterEvent,
  FilterFieldConfig,
  HeaderComponent,
  IconComponent,
  TableComponent,
  TableConfig,
  TableFilterComponent,
  TablePaginatorComponent,
} from 'ngx-eco-theme';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { FileUploadComponent } from '../../../../ngx-eco-theme/src/public-api';

interface MyItem {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'eco-theme-test',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TableComponent,
    TablePaginatorComponent,
    ChipComponent,
    IconComponent,
    TableFilterComponent,
    HeaderComponent,
    FileUploadComponent,
  ],
  providers: [{ provide: BACK_ROUTES, useValue: [] }],
  templateUrl: './theme-test.component.html',
  styleUrl: './theme-test.component.scss',
})
export class ThemeTestComponent implements OnInit, OnDestroy {
  tableData = signal<MyItem[]>([]);
  totalItems = signal<number>(0);
  tableConfig = signal<TableConfig<MyItem>>({ columns: [], loading: false });

  currentPageIndex = signal(0);
  currentPageSize = signal(10);
  currentSearchText = signal('');

  private queryParams$$ = new Subject<FilterEvent>();
  private destroy$$ = new Subject<void>();

  icons = ECO_ICONS;

  roles = signal([
    { value: 'admin', label: 'Администратор' },
    { value: 'chief', label: 'Начелник' },
    { value: 'employee', label: 'Службеник' },
    { value: 'trainee', label: 'Приправник' },
  ]);

  filters: FilterFieldConfig[] = [
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: 'active', label: 'активан' },
        { value: 'blocked', label: 'блокиран' },
      ],
    },
    {
      key: 'roles',
      label: 'Роле',
      type: 'multiselect',
      options: [
        { value: 'active', label: 'активан' },
        { value: 'blocked', label: 'блокиран' },
      ],
    },
  ];

  constructor() {
    this.tableConfig.set({
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Ime' },
        {
          key: 'status',
          label: 'Status',
          type: 'badge',
          align: 'center',
          badgeConfig: {
            getValue: row => row.status,
            getClass: row => `${row.status}`,
            getIcon: () => 'circle',
          },
        },
        {
          key: 'actions',
          label: 'Akcije',
          type: 'actions',
          width: '10%',
          align: 'center',
          actions: [{ icon: 'edit', onClick: row => console.log('Edit', row) }],
        },
      ],
      loading: false,
      emptyMessage: 'Nema rezultata po zadatom upitu.',
    });

    this.queryParams$$.pipe(debounceTime(50), takeUntil(this.destroy$$)).subscribe(event => {
      this.loadData(event);
    });
  }

  ngOnInit(): void {
    this.emitQueryParams();
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

  private emitQueryParams(): void {
    const event: FilterEvent = {
      pageIndex: this.currentPageIndex(),
      pageSize: this.currentPageSize(),
    };
    this.queryParams$$.next(event);
  }

  loadData(event: FilterEvent): void {
    this.tableConfig.update(config => ({ ...config, loading: true }));

    // Simulating API call:
    setTimeout(() => {
      const mockData: MyItem[] = Array.from({ length: event.pageSize }, (_, i) => ({
        id: i + 1 + event.pageIndex * event.pageSize,
        name: `Stavka ${i + 1 + event.pageIndex * event.pageSize}`,
        status: ['active', 'inactive'][i % 2] as 'active' | 'inactive',
      }));

      this.tableData.set(mockData);
      this.totalItems.set(100);
      this.tableConfig.update(config => ({ ...config, loading: false }));
    }, 500);
  }

  onFilter(value: unknown) {
    console.log('FILTER:', value);
  }
}
