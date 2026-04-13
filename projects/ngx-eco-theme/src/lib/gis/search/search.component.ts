import { Component, inject, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';

@Component({
  selector: 'eco-search',
  standalone: true,
  imports: [CommonModule, AsyncPipe, IconComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  placeholder = input<string>('');
  value = input<string>('');

  searchSubmit = output<string>();
  valueChange = output<string>();

  searchValue = signal('');

  ngOnInit(): void {
    this.searchValue.set(this.value());
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
    this.valueChange.emit(target.value);
  }

  onSearch(): void {
    this.searchSubmit.emit(this.searchValue());
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
