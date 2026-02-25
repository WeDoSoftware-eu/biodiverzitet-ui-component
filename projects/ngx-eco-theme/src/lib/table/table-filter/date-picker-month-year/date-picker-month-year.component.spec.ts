import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

import { DatePickerMonthYearComponent } from './date-picker-month-year.component';

describe('DatePickerMonthYearComponent', () => {
  let component: DatePickerMonthYearComponent;
  let fixture: ComponentFixture<DatePickerMonthYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerMonthYearComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerMonthYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
