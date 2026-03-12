import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import { LayersButtonComponent } from './layers-button.component';

describe('LayersButtonComponent', () => {
  let component: LayersButtonComponent;
  let componentRef: ComponentRef<LayersButtonComponent>;
  let fixture: ComponentFixture<LayersButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit buttonClick when onClick is called', () => {
    let emitted = false;
    component.buttonClick.subscribe(() => {
      emitted = true;
    });

    component.onClick();

    expect(emitted).toBeTrue();
  });

  it('should emit buttonClick when button element is clicked', () => {
    let emitted = false;
    component.buttonClick.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should render the button with correct aria-label', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Slojevi mape');
  });

  it('should render the eco-icon inside the button', () => {
    const icon = fixture.nativeElement.querySelector('button .icon eco-icon');
    expect(icon).toBeTruthy();
  });

  it('should not have active class by default', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeFalse();
  });

  it('should add active class when isActive is true', () => {
    componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeTrue();
  });

  it('should remove active class when isActive is set back to false', () => {
    componentRef.setInput('isActive', true);
    fixture.detectChanges();

    componentRef.setInput('isActive', false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeFalse();
  });
});
