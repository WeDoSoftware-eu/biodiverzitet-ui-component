# Table Component

## Basic Setup

Import the required components in your Angular component:

```typescript
import { TableComponent, TableConfig, TablePaginatorComponent } from 'ngx-eco-theme';
```

## Usage

### Simple Table

```typescript
import { Component, signal } from '@angular/core';
import { TableComponent, TableConfig } from 'ngx-eco-theme';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableComponent],
  template: ` <eco-table [config]="tableConfig()" [data]="tableData()"> </eco-table> `,
})
export class UsersComponent {
  tableData = signal<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  tableConfig = signal<TableConfig<User>>({
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
    ],
  });
}
```

### Table with Pagination

```typescript
import { PageEvent } from '@angular/material/paginator';
import { TablePaginatorComponent } from 'ngx-eco-theme';

@Component({
  template: `
    <eco-table [config]="tableConfig()" [data]="tableData()"> </eco-table>

    <eco-table-paginator
      [totalItems]="totalItems()"
      [pageSize]="pageSize()"
      [pageIndex]="pageIndex()"
      (pageChange)="onPageChange($event)"
    >
    </eco-table-paginator>
  `,
})
export class UsersComponent {
  tableData = signal<User[]>([]);
  totalItems = signal(100);
  pageSize = signal(10);
  pageIndex = signal(0);

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  loadData(): void {
    // Fetch data from API
  }
}
```

## Column Configuration

### Text Columns

Basic text display:

```typescript
{ key: 'name', label: 'Name' }
```

### Nested Properties

Access nested object properties using dot notation:

```typescript
{ key: 'user.profile.firstName', label: 'First Name' }
```

### Badge Columns

Display status badges with custom styling:

```typescript
{
  key: 'status',
  label: 'Status',
  type: 'badge',
  align: 'center',
  badgeConfig: {
    getValue: (row) => row.status,
    getClass: (row) => `${row.status.toLowerCase()}`
  }
}
```

Add corresponding CSS classes:

```scss
&.active {
  background-color: $chip-active-badge-bg;
  --mdc-chip-label-text-color: #{$chip-active-badge-color};

  mat-icon {
    color: $chip-active-badge-color;
  }
}

&.inactive {
  background-color: $chip-inactive-badge-bg;
  --mdc-chip-label-text-color: #{$chip-inactive-badge-color};

  mat-icon {
    color: $chip-inactive-badge-color;
  }
}

&.completed {
  background-color: $chip-done-badge-bg;
  --mdc-chip-label-text-color: #{$chip-done-badge-color};

  mat-icon {
    color: $chip-done-badge-color;
  }
}

&.in-progress {
  background-color: $chip-in-progress-badge-bg;
  --mdc-chip-label-text-color: #{$chip-in-progress-badge-color};

  mat-icon {
    color: $chip-in-progress-badge-color;
  }
}
```

### Date Columns

Format dates using Angular's date pipe:

```typescript
{
  key: 'createdAt',
  label: 'Created',
  type: 'date',
  pipe: 'date',
  pipeFormat: 'dd/MM/yyyy'
}
```

Available date formats:

- `'short'` - 1/1/24, 12:00 PM
- `'medium'` - Jan 1, 2024, 12:00:00 PM
- `'long'` - January 1, 2024 at 12:00:00 PM
- `'dd/MM/yyyy'` - 01/01/2024
- `'MM/dd/yyyy HH:mm'` - 01/01/2024 12:00

### Number Columns

Format numbers using Angular's number pipe:

```typescript
{
  key: 'price',
  label: 'Price',
  pipe: 'number',
  pipeFormat: '1.2-2'
}
```

Format pattern: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

Examples:

- `'1.0-0'` - 1234 (no decimals)
- `'1.2-2'` - 1234.56 (always 2 decimals)
- `'1.0-2'` - 1234.5 (up to 2 decimals)

### Action Columns

Add interactive buttons to each row:

```typescript
{
  key: 'actions',
  label: 'Actions',
  type: 'actions',
  width: '150px',
  align: 'center',
  actions: [
    {
      icon: 'edit',
      tooltip: 'Edit',
      onClick: (row) => this.editUser(row)
    },
    {
      icon: 'delete',
      tooltip: 'Delete',
      color: 'warn',
      show: (row) => row.status !== 'active',
      onClick: (row) => this.deleteUser(row)
    }
  ]
}
```

Action properties:

- `icon` - Material icon name
- `tooltip` - Hover text
- `color` - Material button color (primary, accent, warn)
- `show` - Function to conditionally display the action
- `onClick` - Click handler function

### Column Width and Alignment

```typescript
{
  key: 'id',
  label: 'ID',
  width: '80px',
  align: 'center'
}
```

Alignment options: `'left'`, `'center'`, `'right'`

## Loading State

Show a loading spinner while fetching data:

```typescript
tableConfig = signal<TableConfig<User>>({
  columns: [...],
  loading: true
});

// After data loads
this.tableConfig.update(config => ({ ...config, loading: false }));
```

## Empty State

Customize the message when no data is available:

```typescript
tableConfig = signal<TableConfig<User>>({
  columns: [...],
  emptyMessage: 'No users found'
});
```

## Server-Side Data

Handle server-side pagination and filtering:

```typescript
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FilterEvent } from 'ngx-eco-theme';

export class UsersComponent {
  private queryParams$ = new Subject<FilterEvent>();
  private destroy$ = new Subject<void>();

  currentPageIndex = signal(0);
  currentPageSize = signal(10);
  currentSearchText = signal('');

  constructor() {
    this.queryParams$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(event => {
      this.fetchDataFromAPI(event);
    });
  }

  ngOnInit(): void {
    this.emitQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.queryParams$.next(event);
  }

  fetchDataFromAPI(params: FilterEvent): void {
    this.tableConfig.update(config => ({ ...config, loading: true }));

    this.apiService.getUsers(params).subscribe(response => {
      this.tableData.set(response.data);
      this.totalItems.set(response.total);
      this.tableConfig.update(config => ({ ...config, loading: false }));
    });
  }
}
```

## Complete Example

```typescript
import { Component, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TableComponent, TableConfig, TablePaginatorComponent, FilterEvent } from 'ngx-eco-theme';
import { debounceTime, Subject, takeUntil } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TableComponent, TablePaginatorComponent],
  template: `
    <eco-table [config]="tableConfig()" [data]="tableData()"> </eco-table>

    <eco-table-paginator
      [totalItems]="totalItems()"
      [pageSize]="currentPageSize()"
      [pageIndex]="currentPageIndex()"
      (pageChange)="onPageChange($event)"
    >
    </eco-table-paginator>
  `,
})
export class ProductsComponent {
  tableData = signal<Product[]>([]);
  totalItems = signal(0);

  currentPageIndex = signal(0);
  currentPageSize = signal(10);
  currentSearchText = signal('');

  private queryParams$ = new Subject<FilterEvent>();
  private destroy$ = new Subject<void>();

  tableConfig = signal<TableConfig<Product>>({
    columns: [
      {
        key: 'id',
        label: 'ID',
        width: '80px',
      },
      {
        key: 'name',
        label: 'Product Name',
      },
      {
        key: 'price',
        label: 'Price',
        pipe: 'number',
        pipeFormat: '1.2-2',
        align: 'right',
      },
      {
        key: 'stock',
        label: 'Stock',
        pipe: 'number',
        pipeFormat: '1.0-0',
        align: 'center',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        align: 'center',
        badgeConfig: {
          getValue: row => (row.status === 'active' ? 'Active' : 'Inactive'),
          getClass: row => `${row.status}`,
        },
      },
      {
        key: 'createdAt',
        label: 'Created',
        type: 'date',
        pipe: 'date',
        pipeFormat: 'dd/MM/yyyy',
      },
      {
        key: 'actions',
        label: 'Actions',
        type: 'actions',
        width: '120px',
        align: 'center',
        actions: [
          {
            icon: 'edit',
            tooltip: 'Edit Product',
            onClick: row => this.editProduct(row),
          },
          {
            icon: 'delete',
            tooltip: 'Delete Product',
            color: 'warn',
            show: row => row.stock === 0,
            onClick: row => this.deleteProduct(row),
          },
        ],
      },
    ],
    loading: false,
    emptyMessage: 'No products found',
  });

  constructor() {
    this.queryParams$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(event => {
      this.loadData(event);
    });
  }

  ngOnInit(): void {
    this.emitQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.queryParams$.next(event);
  }

  loadData(event: FilterEvent): void {
    this.tableConfig.update(config => ({ ...config, loading: true }));

    // Replace with actual API call
    setTimeout(() => {
      const mockData: Product[] = Array.from({ length: event.pageSize }, (_, i) => ({
        id: i + 1 + event.pageIndex * event.pageSize,
        name: `Product ${i + 1}`,
        price: Math.random() * 100,
        stock: Math.floor(Math.random() * 50),
        status: i % 2 === 0 ? 'available' : 'out-of-stock',
        createdAt: new Date().toISOString(),
      }));

      this.tableData.set(mockData);
      this.totalItems.set(100);
      this.tableConfig.update(config => ({ ...config, loading: false }));
    }, 500);
  }

  editProduct(product: Product): void {
    console.log('Edit:', product);
  }

  deleteProduct(product: Product): void {
    console.log('Delete:', product);
  }
}
```
