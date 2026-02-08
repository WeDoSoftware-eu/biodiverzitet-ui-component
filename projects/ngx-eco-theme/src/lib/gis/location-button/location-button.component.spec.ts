import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationButtonComponent } from './location-button.component';

describe('LocationButtonComponent', () => {
  let component: LocationButtonComponent;
  let fixture: ComponentFixture<LocationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationButtonComponent],
    })
      .overrideComponent(LocationButtonComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LocationButtonComponent);
    component = fixture.componentInstance;
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
    expect(button.getAttribute('aria-label')).toBe('Pronadi moju lokaciju');
  });

  it('should render the SVG icon inside the button', () => {
    const svg = fixture.nativeElement.querySelector('button .icon svg');
    expect(svg).toBeTruthy();
  });

  it('should not have active class by default', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeFalse();
  });

  it('should add active class when isActive is true', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeTrue();
  });

  it('should remove active class when isActive is set back to false', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBeFalse();
  });
});
