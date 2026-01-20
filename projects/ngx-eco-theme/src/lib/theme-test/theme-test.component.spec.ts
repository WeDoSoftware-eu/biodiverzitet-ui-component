import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTestComponent } from './theme-test.component';
import { BACK_ROUTES } from '../header/back-route.token';
import { provideRouter } from '@angular/router';

describe('ThemeTestComponent', () => {
  let component: ThemeTestComponent;
  let fixture: ComponentFixture<ThemeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeTestComponent],
      providers: [{ provide: BACK_ROUTES, useValue: [] }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
