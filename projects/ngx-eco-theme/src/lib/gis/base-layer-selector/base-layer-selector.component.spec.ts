import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseLayerSelectorComponent } from './base-layer-selector.component';

describe('BaseLayerSelectorComponent', () => {
  const BASE_LAYER_BTN = '.base-layer-button';
  const ARIA_LABEL = 'aria-label';

  let component: BaseLayerSelectorComponent;
  let fixture: ComponentFixture<BaseLayerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseLayerSelectorComponent],
    })
      .overrideComponent(BaseLayerSelectorComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BaseLayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Подлоге');
  });

  it('should emit closeSelector when onClose is called', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    component.onClose();

    expect(emitted).toBeTrue();
  });

  it('should emit closeSelector when close button is clicked', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('.close-button');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should emit layerChange when selectLayer is called', () => {
    let emittedValue: string | undefined;
    component.layerChange.subscribe((value: string) => {
      emittedValue = value;
    });

    component.selectLayer('satellite');

    expect(emittedValue).toBe('satellite');
  });

  it('should emit layerChange when a layer button is clicked', () => {
    let emittedValue: string | undefined;
    component.layerChange.subscribe((value: string) => {
      emittedValue = value;
    });

    const buttons = fixture.nativeElement.querySelectorAll(BASE_LAYER_BTN);
    buttons[1].click();

    expect(emittedValue).toBe('satellite');
  });

  it('should render close button with correct aria-label', () => {
    const button = fixture.nativeElement.querySelector('.close-button');
    expect(button.getAttribute(ARIA_LABEL)).toBe('Затвори');
  });

  it('should render layer buttons with correct aria-labels', () => {
    const buttons = fixture.nativeElement.querySelectorAll(BASE_LAYER_BTN);
    expect(buttons[0].getAttribute(ARIA_LABEL)).toBe('Карта');
    expect(buttons[1].getAttribute(ARIA_LABEL)).toBe('Сателит');
  });

  it('should have map selected by default', () => {
    const buttons = fixture.nativeElement.querySelectorAll(BASE_LAYER_BTN);
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
  });

  it('should apply selected class to satellite when selectedLayer is satellite', () => {
    fixture.componentRef.setInput('selectedLayer', 'satellite');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(BASE_LAYER_BTN);
    expect(buttons[1].classList.contains('selected')).toBeTrue();
  });

  it('should remove selected class from map when satellite is selected', () => {
    fixture.componentRef.setInput('selectedLayer', 'satellite');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(BASE_LAYER_BTN);
    expect(buttons[0].classList.contains('selected')).toBeFalse();
    expect(buttons[1].classList.contains('selected')).toBeTrue();
  });
});
