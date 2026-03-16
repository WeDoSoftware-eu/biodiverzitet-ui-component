import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { TableFilterStoreService } from './table-filter-store';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../../eco-theme-I18n';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePickerMonthYearComponent } from './date-picker-month-year/date-picker-month-year.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchableSelectComponent } from '../../searchable-select/searchable-select.component';

export type FilterFieldType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'tristate'
  | 'month-year';

export interface FilterOption {
  value: string | number | boolean;
  label: string;
}

export interface TriStateOption {
  value: string;
  label: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterOption[];
  selectSearch?: boolean;
  triStateOptions?: TriStateOption[];
}

export interface TriStateValue {
  [key: string]: boolean;
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
    MatCheckboxModule,
    MatInputModule,
    DatePickerMonthYearComponent,
    MatTooltipModule,
    SearchableSelectComponent,
  ],
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.scss',
})
export class TableFilterComponent implements OnDestroy {
  public i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  id = input.required<string>();
  fields = input.required<FilterFieldConfig[]>();
  changed = output<Record<string, unknown>>();

  private store = inject(TableFilterStoreService);
  private destroy$ = new Subject<void>();

  form = signal<FormGroup>(new FormGroup({}));
  formReady = signal(false);
  formValue = signal<Record<string, unknown>>({});

  triStateLabels = computed(() => {
    const values = this.formValue();
    const labels: Record<string, string> = {};

    this.fields()
      .filter(f => f.type === 'tristate')
      .forEach(field => {
        const value = values[field.key] as TriStateValue;

        if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
          labels[field.key] = field.label || '';
        } else {
          const selected = Object.keys(value)
            .map(id => field.triStateOptions?.find(opt => opt.value === id)?.label)
            .filter(Boolean);

          labels[field.key] =
            selected.length > 0 ? `${field.label}: ${selected.join(', ')}` : field.label || '';
        }
      });

    return labels;
  });

  triStateCheckedStates = computed(() => {
    const values = this.formValue();
    const states: Record<string, boolean> = {};

    this.fields()
      .filter(f => f.type === 'tristate')
      .forEach(field => {
        const value = values[field.key] as TriStateValue;

        if (!value || typeof value !== 'object') {
          return;
        }

        field.triStateOptions?.forEach(option => {
          const state = value[option.value];
          if (state !== undefined) {
            states[`${field.key}:${option.value}:yes`] = state === true;
            states[`${field.key}:${option.value}:no`] = state === false;
          }
        });
      });

    return states;
  });

  getControl(key: string): FormControl {
    return this.form().get(key) as FormControl;
  }

  constructor() {
    effect(
      () => {
        const f = this.fields();
        if (f.length > 0) {
          this.buildForm(f);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (!this.formReady()) return;
        const saved = this.store.get(this.id())();
        this.form().patchValue(saved, { emitEvent: false });
        this.formValue.set(this.form().value);
      },
      { allowSignalWrites: true }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(fields: FilterFieldConfig[]) {
    this.destroy$.next();

    const group: Record<string, FormControl> = {};

    for (const f of fields) {
      if (f.type === 'tristate') {
        group[f.key] = new FormControl({});
      } else if (f.type === 'multiselect') {
        group[f.key] = new FormControl([]);
      } else if (f.type === 'checkbox') {
        group[f.key] = new FormControl(false);
      } else {
        group[f.key] = new FormControl(null);
      }
    }

    const fg = new FormGroup(group);

    fg.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(value => {
      this.formValue.set(value);
      this.store.set(this.id(), value);
      this.changed.emit(value);
    });

    this.form.set(fg);
    this.formReady.set(true);
  }

  onTriStateChange(fieldKey: string, optionId: string | number, targetValue: boolean): void {
    const control = this.form().get(fieldKey);
    if (!control) return;

    const currentValue = control.value as TriStateValue;
    const newValue: TriStateValue =
      currentValue && typeof currentValue === 'object' ? { ...currentValue } : {};

    const currentState = newValue[optionId];

    if (currentState === targetValue) {
      delete newValue[optionId];
    } else {
      newValue[optionId] = targetValue;
    }

    control.setValue(newValue);
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>, formKey: string) {
    const ctrlValue: Date = this.form().get(formKey)?.value ?? new Date();
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.form().get(formKey)?.setValue(new Date(ctrlValue));
    datepicker.close();
  }
}
