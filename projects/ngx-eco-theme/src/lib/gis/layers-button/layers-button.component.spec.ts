import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersButtonComponent } from './layers-button.component';

const BUTTON_SELECTOR = '.layers-button';

describe('LayersButtonComponent', () => {
  let component: LayersButtonComponent;
  let fixture: ComponentFixture<LayersButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersButtonComponent);
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

  it('should apply "active" class when isActive signal is true', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.classList.contains('active')).toBeTrue();
  });

  it('should not have "active" class when isActive signal is false', () => {
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
    expect(button.getAttribute('aria-label')).toBe('Slojevi mape');
    expect(button.getAttribute('title')).toBe('Slojevi');
  });
});
