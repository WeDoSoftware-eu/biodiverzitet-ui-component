import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessMobileComponent } from './no-access-mobile.component';

describe('NoAccessMobileComponent', () => {
  let component: NoAccessMobileComponent;
  let fixture: ComponentFixture<NoAccessMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAccessMobileComponent]
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
