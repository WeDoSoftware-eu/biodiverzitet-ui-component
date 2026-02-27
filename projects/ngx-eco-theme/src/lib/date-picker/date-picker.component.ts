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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { DatePickerIntlModel } from './date-picker-intl.model';
import { Observable } from 'rxjs';

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

  selectedDate = model<Date | null>(null);

  dateRange = model<DateRange>({ start: null, end: null });

  dateChange = output<Date | null>();
  rangeChange = output<DateRange>();

  dateControl = new FormControl<Date | null>(null);
  rangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  intlModel: DatePickerIntlModel = {
    calendarLabel: toSignal(this.i18n.datePicker.calendarLabel),
    clearDateLabel: toSignal(this.i18n.datePicker.clearDateLabel),
    closeCalendarLabel: toSignal(this.i18n.datePicker.closeCalendarLabel),
    fromDate: toSignal(this.i18n.datePicker.fromDate),
    nextMonthLabel: toSignal(this.i18n.datePicker.nextMonthLabel),
    nextMultiYearLabel: toSignal(this.i18n.datePicker.nextMultiYearLabel),
    nextYearLabel: toSignal(this.i18n.datePicker.nextYearLabel),
    openCalendarLabel: toSignal(this.i18n.datePicker.openCalendarLabel),
    prevMonthLabel: toSignal(this.i18n.datePicker.prevMonthLabel),
    prevMultiYearLabel: toSignal(this.i18n.datePicker.prevMultiYearLabel),
    prevYearLabel: toSignal(this.i18n.datePicker.prevYearLabel),
    selectDate: toSignal(this.i18n.datePicker.selectDate),
    selectPeriod: toSignal(this.i18n.datePicker.selectPeriod),
    switchToMultiYearViewLabel: toSignal(this.i18n.datePicker.switchToMultiYearViewLabel),
    toDate: toSignal(this.i18n.datePicker.toDate),
  };

  labelText = computed(() => {
    const customLabel = this.label();
    if (customLabel) return customLabel;

    const mode = this.mode();
    return mode === 'single' ? this.intlModel.selectDate() : this.intlModel.selectPeriod();
  });

  startLabelText = computed(() => {
    const customLabel = this.startLabel();
    return customLabel || this.intlModel.fromDate();
  });

  endLabelText = computed(() => {
    const customLabel = this.endLabel();
    return customLabel || this.intlModel.toDate();
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
    this.datepickerIntl.switchToMultiYearViewLabel = this.intlModel.switchToMultiYearViewLabel()!;
    this.datepickerIntl.nextMonthLabel = this.intlModel.nextMonthLabel()!;
    this.datepickerIntl.nextYearLabel = this.intlModel.nextYearLabel()!;
    this.datepickerIntl.nextMultiYearLabel = this.intlModel.nextMultiYearLabel()!;
    this.datepickerIntl.prevMonthLabel = this.intlModel.prevMonthLabel()!;
    this.datepickerIntl.prevYearLabel = this.intlModel.prevYearLabel()!;
    this.datepickerIntl.prevMultiYearLabel = this.intlModel.prevMultiYearLabel()!;
    this.datepickerIntl.calendarLabel = this.intlModel.calendarLabel()!;
    this.datepickerIntl.openCalendarLabel = this.intlModel.openCalendarLabel()!;
    this.datepickerIntl.closeCalendarLabel = this.intlModel.closeCalendarLabel()!;
    this.datepickerIntl.changes.next();
  }
}
