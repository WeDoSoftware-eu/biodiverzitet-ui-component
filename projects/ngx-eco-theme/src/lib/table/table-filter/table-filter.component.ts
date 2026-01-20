import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { debounceTime } from 'rxjs';
import { TableFilterStoreService } from './table-filter-store';
import { ButtonComponent } from '../../button/button.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../../eco-theme-I18n';

export type FilterFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'date';

export interface FilterOption {
  value: unknown;
  label: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterOption[];
}

@Component({
  selector: 'eco-table-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ButtonComponent,
  ],
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.scss',
})
export class TableFilterComponent {
  public i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  id = input.required<string>();
  fields = input.required<FilterFieldConfig[]>();
  changed = output<Record<string, unknown>>();

  cancelButtonTitle = signal('');

  private store = inject(TableFilterStoreService);

  form = signal<FormGroup>(new FormGroup({}));
  formReady = signal(false);
  hasFilters = signal(false);

  constructor() {
    effect(
      () => {
        const f = this.fields();
        if (this.fields().length > 0) this.buildForm(f);
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      if (!this.formReady()) return;
      const saved = this.store.get(this.id())();
      this.form().patchValue(saved, { emitEvent: false });

      setTimeout(() => this.checkHasFilters(), 0);
    });
  }

  private buildForm(fields: FilterFieldConfig[]) {
    const group: Record<string, FormControl> = {};

    for (const f of fields) {
      group[f.key] = new FormControl(
        f.type === 'multiselect' ? [] : f.type === 'checkbox' ? false : null
      );
    }

    const fg = new FormGroup(group);

    fg.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.store.set(this.id(), value);
      this.changed.emit(value);
      this.checkHasFilters();
    });

    this.form.set(fg);
    this.formReady.set(true);
  }

  private checkHasFilters() {
    const values = this.form().value;
    const hasAnyValue = Object.values(values).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'boolean') {
        return value === true;
      }
      return value !== null && value !== undefined && value !== '';
    });
    this.hasFilters.set(hasAnyValue);
  }

  clear() {
    this.form().reset();
    this.store.clear(this.id());
    this.changed.emit({});
    this.hasFilters.set(false);
  }
}
