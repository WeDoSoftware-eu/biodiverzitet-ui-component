import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'eco-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  private datepickerIntl: MatDatepickerIntl = inject(MatDatepickerIntl);
  private destroyRef = inject(DestroyRef);

  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;
  mode = input<'single' | 'range'>('single');
  label = input<string>('');
  startLabel = input<string>('');
  endLabel = input<string>('');
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  disabled = input<boolean>(false);
  showClearButton = input<boolean>(true);
  /**
   * Flag indicating need for updating date picker internationalization.
   * @example After display language changes.
   */
  updateI18n = input<boolean>();

  selectedDate = model<Date | null>(null);

  dateRange = model<DateRange>({ start: null, end: null });

  dateChange = output<Date | null>();
  rangeChange = output<DateRange>();

  dateControl = new FormControl<Date | null>(null);
  rangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  labelText = computed(() => {
    const customLabel = this.label();
    if (customLabel) return customLabel;

    const mode = this.mode();
    return mode === 'single' ? this.i18n.datePicker.selectDate() : this.i18n.datePicker.selectPeriod();
  });

  startLabelText = computed(() => {
    const customLabel = this.startLabel();
    return customLabel || this.i18n.datePicker.fromDate();
  });

  endLabelText = computed(() => {
    const customLabel = this.endLabel();
    return customLabel || this.i18n.datePicker.toDate();
  });

  hasValue = computed(() => {
    if (this.mode() === 'single') {
      return this.selectedDate() !== null;
    } else {
      const range = this.dateRange();
      return range.start !== null || range.end !== null;
    }
  });

  constructor() {
    this.updateDatepickerIntl();
    effect(() => {
      if (this.mode() === 'single') {
        const date = this.selectedDate();
        if (date !== this.dateControl.value) {
          this.dateControl.setValue(date, { emitEvent: false });
        }
      }
    });

    effect(() => {
      if (this.mode() === 'range') {
        const range = this.dateRange();
        if (
          range.start !== this.rangeGroup.value.start ||
          range.end !== this.rangeGroup.value.end
        ) {
          this.rangeGroup.setValue({ start: range.start, end: range.end }, { emitEvent: false });
        }
      }
    });

    effect(() => {
      if (this.disabled()) {
        this.dateControl.disable();
        this.rangeGroup.disable();
      } else {
        this.dateControl.enable();
        this.rangeGroup.enable();
      }
    });

    effect(() => {
      if (this.updateI18n()) {
        this.updateDatepickerIntl();
      }
    });

    this.dateControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: Date | null) => {
        if (this.mode() === 'single') {
          this.selectedDate.set(value);
          this.dateChange.emit(value);
        }
      });

    this.rangeGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (this.mode() === 'range') {
        const range: DateRange = {
          start: value.start || null,
          end: value.end || null,
        };
        this.dateRange.set(range);
        this.rangeChange.emit(range);
      }
    });
  }

  clearDate(): void {
    if (this.mode() === 'single') {
      this.selectedDate.set(null);
      this.dateControl.setValue(null);
      this.dateChange.emit(null);
    } else {
      const emptyRange: DateRange = { start: null, end: null };
      this.dateRange.set(emptyRange);
      this.rangeGroup.setValue({ start: null, end: null });
      this.rangeChange.emit(emptyRange);
    }
  }

  private updateDatepickerIntl(): void {
    this.datepickerIntl.switchToMultiYearViewLabel =
      this.i18n.datePicker.switchToMultiYearViewLabel();
    this.datepickerIntl.nextMonthLabel = this.i18n.datePicker.nextMonthLabel();
    this.datepickerIntl.nextYearLabel = this.i18n.datePicker.nextYearLabel();
    this.datepickerIntl.nextMultiYearLabel = this.i18n.datePicker.nextMultiYearLabel();
    this.datepickerIntl.prevMonthLabel = this.i18n.datePicker.prevMonthLabel();
    this.datepickerIntl.prevYearLabel = this.i18n.datePicker.prevYearLabel();
    this.datepickerIntl.prevMultiYearLabel = this.i18n.datePicker.prevMultiYearLabel();
    this.datepickerIntl.calendarLabel = this.i18n.datePicker.calendarLabel();
    this.datepickerIntl.openCalendarLabel = this.i18n.datePicker.openCalendarLabel();
    this.datepickerIntl.closeCalendarLabel = this.i18n.datePicker.closeCalendarLabel();
    this.datepickerIntl.changes.next();
  }
}
