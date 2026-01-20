import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconComponent } from '../../icon/icon.component';
import { TableFilterStoreService } from '../table-filter/table-filter-store';
import { FormsModule } from '@angular/forms';
import { debounceInteraction } from '../../../decorators/debounce.decorator';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../../eco-theme-I18n';

@Component({
  selector: 'eco-table-search',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, IconComponent, FormsModule],
  templateUrl: './table-search.component.html',
  styleUrl: './table-search.component.scss',
})
export class TableSearchComponent implements OnInit {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  public storeKey = input.required<string>();

  changed = output();

  public store = inject(TableFilterStoreService);

  public searchText = '';

  @debounceInteraction()
  searchTextChange($event: string): void {
    this.store.set(this.storeKey(), { searchText: $event });
    this.changed.emit();
  }

  ngOnInit(): void {
    const saved = this.store.get(this.storeKey())();
    const searchText = saved['searchText'];
    this.searchText = typeof searchText === 'string' ? searchText : '';
  }
}
