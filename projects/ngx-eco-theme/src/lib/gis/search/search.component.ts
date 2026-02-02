import { Component, OnInit, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  placeholder = input<string>('Претрага');
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
