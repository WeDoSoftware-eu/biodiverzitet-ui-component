import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarComponent } from './snackbar.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackbarData } from './snackbar.service';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  let data: SnackbarData;

  beforeEach(async () => {
    data = {
      message: 'test message',
      type: 'info'
    };

    await TestBed.configureTestingModule({
      imports: [SnackbarComponent],
      providers: [
        {provide: MAT_SNACK_BAR_DATA, useValue: data}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
