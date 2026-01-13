import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseLayerSelectorComponent } from './base-layer-selector.component';

const LAYER_BUTTON_SELECTOR = '.base-layer-button';
const CLOSE_BUTTON_SELECTOR = '.close-button';
const ARIA_LABEL_ATTR = 'aria-label';

describe('BaseLayerSelectorComponent', () => {
  let component: BaseLayerSelectorComponent;
  let fixture: ComponentFixture<BaseLayerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseLayerSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseLayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display map and satellite options', () => {
    const options = fixture.nativeElement.querySelectorAll('.base-layer-option');
    expect(options.length).toBe(2);

    const labels = fixture.nativeElement.querySelectorAll('.base-layer-label');
    expect(labels[0].textContent).toBe('Карта');
    expect(labels[1].textContent).toBe('Сателит');
  });

  it('should apply "selected" class to currently selected layer (map)', () => {
    fixture.componentRef.setInput('selectedLayer', 'map');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(LAYER_BUTTON_SELECTOR);
    expect(buttons[0].classList.contains('selected')).toBeTrue();
    expect(buttons[1].classList.contains('selected')).toBeFalse();
  });

  it('should apply "selected" class to currently selected layer (satellite)', () => {
    fixture.componentRef.setInput('selectedLayer', 'satellite');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(LAYER_BUTTON_SELECTOR);
    expect(buttons[0].classList.contains('selected')).toBeFalse();
    expect(buttons[1].classList.contains('selected')).toBeTrue();
  });

  it('should emit layerChange when map layer is selected', () => {
    let emittedLayer = null as string | null;
    component.layerChange.subscribe(layer => {
      emittedLayer = layer;
    });

    const buttons = fixture.nativeElement.querySelectorAll(LAYER_BUTTON_SELECTOR);
    buttons[0].click();

    expect(emittedLayer).toBe('map');
  });

  it('should emit layerChange when satellite layer is selected', () => {
    let emittedLayer = null as string | null;
    component.layerChange.subscribe(layer => {
      emittedLayer = layer;
    });

    const buttons = fixture.nativeElement.querySelectorAll(LAYER_BUTTON_SELECTOR);
    buttons[1].click();

    expect(emittedLayer).toBe('satellite');
  });

  it('should emit layerChange when selectLayer method is called', () => {
    let emittedLayer = null as string | null;
    component.layerChange.subscribe(layer => {
      emittedLayer = layer;
    });

    component.selectLayer('satellite');

    expect(emittedLayer).toBe('satellite');
  });

  it('should emit closeSelector when close button is clicked', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON_SELECTOR);
    closeButton.click();

    expect(emitted).toBeTrue();
  });

  it('should emit closeSelector when onClose method is called', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    component.onClose();

    expect(emitted).toBeTrue();
  });

  it('should default selectedLayer to "map"', () => {
    expect(component.selectedLayer()).toBe('map');
  });

  it('should display header with title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Подлоге');
  });

  it('should have correct accessibility attributes on layer buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll(LAYER_BUTTON_SELECTOR);
    expect(buttons[0].getAttribute(ARIA_LABEL_ATTR)).toBe('Карта');
    expect(buttons[1].getAttribute(ARIA_LABEL_ATTR)).toBe('Сателит');
  });

  it('should have correct accessibility attributes on close button', () => {
    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON_SELECTOR);
    expect(closeButton.getAttribute(ARIA_LABEL_ATTR)).toBe('Zatvori');
  });

  it('should render images for layer options', () => {
    const images = fixture.nativeElement.querySelectorAll('.base-layer-image');
    expect(images.length).toBe(2);
    expect(images[0].getAttribute('alt')).toBe('OSM Karta');
    expect(images[1].getAttribute('alt')).toBe('Satelit');
  });
});
