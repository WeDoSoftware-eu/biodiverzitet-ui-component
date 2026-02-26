import { Signal } from '@angular/core';

export interface DatePickerIntlModel {
  selectDate: Signal<string | undefined>;
  selectPeriod: Signal<string | undefined>;
  fromDate: Signal<string | undefined>;
  toDate: Signal<string | undefined>;
  switchToMultiYearViewLabel: Signal<string | undefined>;
  nextMonthLabel: Signal<string | undefined>;
  nextYearLabel: Signal<string | undefined>;
  nextMultiYearLabel: Signal<string | undefined>;
  prevMonthLabel: Signal<string | undefined>;
  prevYearLabel: Signal<string | undefined>;
  prevMultiYearLabel: Signal<string | undefined>;
  calendarLabel: Signal<string | undefined>;
  openCalendarLabel: Signal<string | undefined>;
  closeCalendarLabel: Signal<string | undefined>;
  clearDateLabel: Signal<string | undefined>;
}
