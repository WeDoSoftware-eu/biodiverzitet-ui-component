import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NoAccessMobileComponent } from './no-access-mobile.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../eco-theme-I18n';

describe('NoAccessMobileComponent', () => {
  let component: NoAccessMobileComponent;
  let fixture: ComponentFixture<NoAccessMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAccessMobileComponent],
      providers: [
        { provide: ECO_THEME_I18N, useValue: DEFAULT_ECO_THEME_I18N },
        provideNoopAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAccessMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
