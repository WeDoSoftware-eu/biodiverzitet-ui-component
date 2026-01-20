import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { BACK_ROUTES } from './back-route.token';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([{ path: 'header', component: HeaderComponent }]),
        { provide: BACK_ROUTES, useValue: [] },
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should create', async () => {
    component = await harness.navigateByUrl('/header', HeaderComponent);

    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(HeaderComponent);
  });
});
