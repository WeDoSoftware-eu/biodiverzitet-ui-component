import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl } from '@angular/forms';

import { DatePickerMonthYearComponent } from './date-picker-month-year.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DatePickerMonthYearComponent', () => {
  let component: DatePickerMonthYearComponent;
  let fixture: ComponentFixture<DatePickerMonthYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerMonthYearComponent, NoopAnimationsModule],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerMonthYearComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('control', new FormControl());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
