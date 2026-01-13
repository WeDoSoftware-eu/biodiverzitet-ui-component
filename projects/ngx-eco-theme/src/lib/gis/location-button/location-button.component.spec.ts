import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationButtonComponent } from './location-button.component';

const BUTTON_SELECTOR = '.location-button';
const CONTAINER_SELECTOR = '.location-container';

describe('LocationButtonComponent', () => {
  let component: LocationButtonComponent;
  let fixture: ComponentFixture<LocationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit buttonClick when clicked', () => {
    let emitted = false;
    component.buttonClick.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should emit buttonClick when onClick method is called', () => {
    let emitted = false;
    component.buttonClick.subscribe(() => {
      emitted = true;
    });

    component.onClick();

    expect(emitted).toBeTrue();
  });

  it('should apply "active" class to container when isActive is true', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(CONTAINER_SELECTOR);
    expect(container.classList.contains('active')).toBeTrue();
  });

  it('should apply "active" class to button when isActive is true', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.classList.contains('active')).toBeTrue();
  });

  it('should not have "active" class on container when isActive is false', () => {
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(CONTAINER_SELECTOR);
    expect(container.classList.contains('active')).toBeFalse();
  });

  it('should not have "active" class on button when isActive is false', () => {
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.classList.contains('active')).toBeFalse();
  });

  it('should have isActive signal default to false', () => {
    expect(component.isActive()).toBeFalse();
  });

  it('should render SVG icon', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('should have correct accessibility attributes', () => {
    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.getAttribute('aria-label')).toBe('Pronadi moju lokaciju');
    expect(button.getAttribute('title')).toBe('Moja lokacija');
    expect(button.getAttribute('type')).toBe('button');
  });
});
