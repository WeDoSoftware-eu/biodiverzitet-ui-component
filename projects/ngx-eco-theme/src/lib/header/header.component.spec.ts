import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([
          { path: 'header', component: HeaderComponent }
        ]),
      ]
    });

    harness = await RouterTestingHarness.create();
  });

  it('should create', async () => {
    component = await harness.navigateByUrl('/header', HeaderComponent);

    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(HeaderComponent);
  });
});
