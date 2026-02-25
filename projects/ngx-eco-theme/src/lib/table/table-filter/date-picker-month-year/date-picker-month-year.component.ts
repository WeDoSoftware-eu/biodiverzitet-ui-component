import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
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
  placeholder = input<string>('');
  control = input.required<FormControl>();

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const existing = this.control().value;
    const ctrlValue: Date = existing ? new Date(existing) : new Date();
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.control().setValue(ctrlValue);
    datepicker.close();
  }
}
