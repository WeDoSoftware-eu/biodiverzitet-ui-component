import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerMonthYearComponent } from './date-picker-month-year.component';

describe('DatePickerMonthYearComponent', () => {
  let component: DatePickerMonthYearComponent;
  let fixture: ComponentFixture<DatePickerMonthYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerMonthYearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerMonthYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
