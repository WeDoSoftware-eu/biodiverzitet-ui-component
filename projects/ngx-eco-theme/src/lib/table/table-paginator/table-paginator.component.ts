import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'eco-table-paginator',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './table-paginator.component.html',
  styleUrl: './table-paginator.component.scss',
})
export class TablePaginatorComponent {
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  totalItems = input<number>(0);
  pageSize = input<number>(10);
  pageIndex = input<number>(0);

  pageChange = output<PageEvent>();
  pageInput: number | null = null;

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  rangeLabel = computed(() => {
    console.log(this.totalItems())
    const total = this.totalItems();
    const size = this.pageSize();
    const index = this.pageIndex();

    if (total === 0) {
      return `Приказано 0 од 0`;
    }
    const startIndex = index * size + 1;
    const endIndex = startIndex < total ? Math.min(startIndex + size - 1, total) : total;

    return `Приказано ${endIndex} од ${total}`;
  });

  pagesToDisplay = computed(() => {
      const total = this.totalPages();
      const current = this.pageIndex() + 1;
      const pages: (number | string)[] = [];

      if (total <= 6) {
          for (let i = 1; i <= total; i++) pages.push(i);
          return pages;
      }

      let start: number;
      let end: number;

      if (current === 1) {
          start = 1;
          end = 3;
      } else if (current >= total - 1) {
          start = total - 2;
          end = total;
      } else {
          start = current - 1;
          end = current + 1;
      }

      if (start > 1) {
          pages.push(1);
          pages.push('...');
      }

      for (let i = start; i <= end; i++) {
          pages.push(i);
      }

      if (end < total - 1) {
          pages.push('...');
          pages.push(total);
      } else if (end === total - 1) {
          pages.push(total);
      }

      return pages;
  });

  goToPage(pageNumber: number | string | null): void {
    if (this.debounceTimeout !== null) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      if (typeof pageNumber === 'number') {
        const pageIndex = pageNumber - 1;
        this.emitPageEvent(pageIndex);
      }
    }, 300);
  }

  goToCustomPage(): void {
    if (this.pageInput !== null && this.pageInput >= 1 && this.pageInput <= this.totalPages()) {
      this.goToPage(this.pageInput);
      this.pageInput = null;
    }
  }

  changePage(step: number | string): void {
    let newIndex;
    if(typeof step === 'number'){
      newIndex =  this.pageIndex() + step;

      if (newIndex >= 0 && newIndex < this.totalPages()) {
        this.emitPageEvent(newIndex);
      }
    }else{
      if (step === 'first') newIndex = 0;
      if (step === 'last') newIndex = this.totalPages() - 1;
    }
  }

  emitPageEvent(pageIndex: number): void {
    if (pageIndex !== this.pageIndex()) {
        this.pageChange.emit({
            pageIndex: pageIndex,
            pageSize: this.pageSize(),
            length: this.totalItems()
        });
    }
  }
}
