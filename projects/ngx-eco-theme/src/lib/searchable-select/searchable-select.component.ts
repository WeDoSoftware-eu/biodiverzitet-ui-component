import { Component, forwardRef, input, signal, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { normalizeForSearch } from './sr-transliterate';

export interface SelectOption {
  value: string | number | boolean;
  label: string;
}

@Component({
  selector: 'eco-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    IconComponent,
  ],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true,
    },
  ],
})
export class SearchableSelectComponent implements ControlValueAccessor, OnDestroy {
  public i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  options = input<SelectOption[]>([]);
  placeholder = input<string>('');
  multiple = input<boolean>(false);
  showSearch = input<boolean>(true);
  appearance = input<'outline' | 'fill'>('outline');

  searchCtrl = new FormControl<string>('', { nonNullable: true });

  private _value = signal<(string | number | boolean)[] | string | number | boolean | null>(null);

  // Search term used only for display none/block logic — never cleared on selection
  private _searchTerm = signal<string>('');

  private _isDisabled = signal<boolean>(false);
  private destroy$ = new Subject<void>();

  private onChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  // Returns whether an option matches the current search term
  isOptionVisible(optionLabel: string): boolean {
    const term = this._searchTerm();
    if (!term) return true;
    console.log(
      normalizeForSearch(optionLabel).includes(normalizeForSearch(term)),
      term,
      optionLabel
    );
    return normalizeForSearch(optionLabel).includes(normalizeForSearch(term));
  }
  // Returns whether any option is visible — used to show the no results message
  hasVisibleOptions = computed(() => {
    const term = this._searchTerm();
    if (!term) return true;
    return this.options().some(o => normalizeForSearch(o.label).includes(normalizeForSearch(term)));
  });

  triggerLabel = computed(() => {
    const selected = this.selectedAsArray();
    const all = this.options();
    if (!selected.length) return '';
    return selected.map(v => all.find(o => o.value === v)?.label ?? String(v)).join(', ');
  });

  isDisabled = computed(() => this._isDisabled());

  selectedAsArray(): (string | number | boolean)[] {
    const v = this._value();
    if (v === null || v === undefined) return [];
    if (Array.isArray(v)) return v;
    return [v];
  }

  get currentValue() {
    return this._value();
  }

  constructor() {
    this.searchCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(term => {
      this._searchTerm.set(term);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: unknown): void {
    this._value.set(value as never);
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }

  onSelectionChange(value: unknown): void {
    this._value.set(value as never);
    this.onChange(value);
    this.onTouched();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    const empty = this.multiple() ? [] : null;
    this._value.set(empty);
    this.onChange(empty);
    this.onTouched();
  }

  onPanelClose(): void {
    // Clear search when panel closes, not on selection
    this.searchCtrl.setValue('');
  }

  onSearchKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
