import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../../eco-theme-I18n';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceInteraction } from '../../../decorators/debounce.decorator';


@Component({
  selector: 'eco-table-paginator',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './table-paginator.component.html',
  styleUrl: './table-paginator.component.scss',
})
export class TablePaginatorComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  totalItems = input<number>(0);
  pageSize = input<number>(10);
  pageIndex = input<number>(0);

  latUpdateTitle = this.i18n.paginator.lastUpdateTitle;
  latUpdate = input<string>('');

  pageChange = output<PageEvent>();
  pageInput: number | null = null;

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  rangeLabel = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    const index = this.pageIndex();

    if (total === 0) {
      return `${this.i18n.paginator.displayedLabel} 0 ${this.i18n.paginator.ofLabel} 0`;
    }
    const startIndex = index * size + 1;
    const endIndex = startIndex < total ? Math.min(startIndex + size - 1, total) : total;

    return `${this.i18n.paginator.displayedLabel} ${endIndex} ${this.i18n.paginator.ofLabel} ${total}`;
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

  @debounceInteraction()
  goToPage(pageNumber: number | string | null): void {
    if (typeof pageNumber === 'number') {
      const pageIndex = pageNumber - 1;
      this.emitPageEvent(pageIndex);
    }
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

      this.emitPageEvent(newIndex as number);
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
