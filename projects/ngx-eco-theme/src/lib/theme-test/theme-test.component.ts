import { Component, signal } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TableComponent } from '../table/table.component';
import { TablePaginatorComponent } from '../table/table-paginator/table-paginator.component';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FilterEvent, TableConfig } from '../table/table.model';
import { PageEvent } from '@angular/material/paginator';
import { ChipComponent } from '../chip/chip.component';

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
    ChipComponent
  ],
  templateUrl: './theme-test.component.html',
  styleUrl: './theme-test.component.scss',
})
export class ThemeTestComponent {
  tableData = signal<MyItem[]>([]);
  totalItems = signal<number>(0);
  tableConfig = signal<TableConfig<MyItem>>({ columns: [], loading: false });

  currentPageIndex = signal(0);
  currentPageSize = signal(10);
  currentSearchText = signal('');

  private queryParams$$ = new Subject<FilterEvent>();
  private destroy$$ = new Subject<void>();

  constructor() {
    this.tableConfig.set({
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Ime'},
        { key: 'status', label: 'Status', type: 'badge', align: 'center',
          badgeConfig: {
            getValue: (row) => row.status,
            getClass: (row) => `${row.status}`,
          }
        },
        { key: 'actions', label: 'Akcije', type: 'actions', width: '10%', align: 'center',
          actions: [{ icon: 'edit', onClick: (row) => console.log('Edit', row) }]
        }
      ],
      loading: false,
      emptyMessage: 'Nema rezultata po zadatom upitu.'
    });

    this.queryParams$$
      .pipe(
        debounceTime(50),
        takeUntil(this.destroy$$)
      )
      .subscribe(event => {
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
      searchText: this.currentSearchText(),
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
            status: ['active', 'inactive'][i % 2] as 'active' | 'inactive'
        }));

        this.tableData.set(mockData);
        this.totalItems.set(100);
        this.tableConfig.update(config => ({ ...config, loading: false }));
    }, 500);
  }
}
