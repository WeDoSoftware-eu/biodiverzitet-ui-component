import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { startWith, switchMap } from 'rxjs';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../../../eco-theme-I18n';
import { IconComponent } from '../../../icon/icon.component';

export const MONTH_YEAR_FORMAT = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'eco-date-picker-month-year',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    IconComponent,
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MONTH_YEAR_FORMAT,
    },
  ],
  templateUrl: './date-picker-month-year.component.html',
  styleUrl: './date-picker-month-year.component.scss',
})
export class DatePickerMonthYearComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  placeholder = input<string>('');
  control = input.required<FormControl>();

  private controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap(ctrl => ctrl.valueChanges.pipe(startWith(ctrl.value)))
    )
  );

  hasValue = computed(() => {
    const val = this.controlValue();
    return val !== null && val !== undefined;
  });

  clearDate(): void {
    this.control().setValue(null);
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const existing = this.control().value;
    const ctrlValue: Date = existing ? new Date(existing) : new Date();
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.control().setValue(ctrlValue);
    datepicker.close();
  }
}
