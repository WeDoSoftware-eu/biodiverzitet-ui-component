import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MapControlsComponent } from './map-controls.component';

const CONTROL_BTN_SELECTOR = '.control-btn';
const ARIA_LABEL_ATTR = 'aria-label';

describe('MapControlsComponent', () => {
  let component: MapControlsComponent;
  let fixture: ComponentFixture<MapControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display zoomLevel', () => {
    fixture.componentRef.setInput('zoomLevel', '150%');
    fixture.detectChanges();

    expect(component.zoomLevel()).toBe('150%');
  });

  it('should have default zoomLevel of 100%', () => {
    expect(component.zoomLevel()).toBe('100%');
  });

  it('should accept numeric zoomLevel', () => {
    fixture.componentRef.setInput('zoomLevel', 75);
    fixture.detectChanges();

    expect(component.zoomLevel()).toBe(75);
  });

  it('should emit zoomIn when zoom in button is clicked', () => {
    let emitted = false;
    component.zoomIn.subscribe(() => {
      emitted = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    buttons[0].click();

    expect(emitted).toBeTrue();
  });

  it('should emit zoomIn when onZoomIn method is called', () => {
    let emitted = false;
    component.zoomIn.subscribe(() => {
      emitted = true;
    });

    component.onZoomIn();

    expect(emitted).toBeTrue();
  });

  it('should emit zoomOut when zoom out button is clicked', () => {
    let emitted = false;
    component.zoomOut.subscribe(() => {
      emitted = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    buttons[1].click();

    expect(emitted).toBeTrue();
  });

  it('should emit zoomOut when onZoomOut method is called', () => {
    let emitted = false;
    component.zoomOut.subscribe(() => {
      emitted = true;
    });

    component.onZoomOut();

    expect(emitted).toBeTrue();
  });

  it('should emit fullscreen when fullscreen button is clicked', () => {
    let emitted = false;
    component.fullscreen.subscribe(() => {
      emitted = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    buttons[3].click();

    expect(emitted).toBeTrue();
  });

  it('should emit fullscreen when onFullscreen method is called', () => {
    let emitted = false;
    component.fullscreen.subscribe(() => {
      emitted = true;
    });

    component.onFullscreen();

    expect(emitted).toBeTrue();
  });

  it('should emit homeViewClick when home button is clicked', () => {
    let emitted = false;
    component.homeViewClick.subscribe(() => {
      emitted = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    buttons[2].click();

    expect(emitted).toBeTrue();
  });

  it('should emit homeViewClick when onHomeViewClick method is called', () => {
    let emitted = false;
    component.homeViewClick.subscribe(() => {
      emitted = true;
    });

    component.onHomeViewClick();

    expect(emitted).toBeTrue();
  });

  it('should set zoomInClicked signal to true then false after click', fakeAsync(() => {
    expect(component.zoomInClicked()).toBeFalse();

    component.onZoomIn();
    expect(component.zoomInClicked()).toBeTrue();

    tick(1000);
    expect(component.zoomInClicked()).toBeFalse();
  }));

  it('should set zoomOutClicked signal to true then false after click', fakeAsync(() => {
    expect(component.zoomOutClicked()).toBeFalse();

    component.onZoomOut();
    expect(component.zoomOutClicked()).toBeTrue();

    tick(1000);
    expect(component.zoomOutClicked()).toBeFalse();
  }));

  it('should set homeViewClicked signal to true then false after click', fakeAsync(() => {
    expect(component.homeViewClicked()).toBeFalse();

    component.onHomeViewClick();
    expect(component.homeViewClicked()).toBeTrue();

    tick(1000);
    expect(component.homeViewClicked()).toBeFalse();
  }));

  it('should apply clicked class to zoom in button when zoomInClicked is true', fakeAsync(() => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);

    component.onZoomIn();
    fixture.detectChanges();

    expect(buttons[0].classList.contains('clicked')).toBeTrue();

    tick(1000);
    fixture.detectChanges();

    expect(buttons[0].classList.contains('clicked')).toBeFalse();
  }));

  it('should apply clicked class to zoom out button when zoomOutClicked is true', fakeAsync(() => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);

    component.onZoomOut();
    fixture.detectChanges();

    expect(buttons[1].classList.contains('clicked')).toBeTrue();

    tick(1000);
    fixture.detectChanges();

    expect(buttons[1].classList.contains('clicked')).toBeFalse();
  }));

  it('should apply clicked class to home view button when homeViewClicked is true', fakeAsync(() => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);

    component.onHomeViewClick();
    fixture.detectChanges();

    expect(buttons[2].classList.contains('clicked')).toBeTrue();

    tick(1000);
    fixture.detectChanges();

    expect(buttons[2].classList.contains('clicked')).toBeFalse();
  }));

  it('should have correct accessibility attributes on zoom in button', () => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    expect(buttons[0].getAttribute(ARIA_LABEL_ATTR)).toBe('Zoom in');
    expect(buttons[0].getAttribute('title')).toBe('Uvećaj');
  });

  it('should have correct accessibility attributes on zoom out button', () => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    expect(buttons[1].getAttribute(ARIA_LABEL_ATTR)).toBe('Zoom out');
    expect(buttons[1].getAttribute('title')).toBe('Umanji');
  });

  it('should have correct accessibility attributes on home view button', () => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    expect(buttons[2].getAttribute(ARIA_LABEL_ATTR)).toBe('Početni pogled');
    expect(buttons[2].getAttribute('title')).toBe('Početni pogled');
  });

  it('should have correct accessibility attributes on fullscreen button', () => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    expect(buttons[3].getAttribute(ARIA_LABEL_ATTR)).toBe('Fullscreen');
    expect(buttons[3].getAttribute('title')).toBe('Ceo ekran');
  });

  it('should render all four control buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll(CONTROL_BTN_SELECTOR);
    expect(buttons.length).toBe(4);
  });

  it('should render divider element', () => {
    const divider = fixture.nativeElement.querySelector('.divider');
    expect(divider).toBeTruthy();
  });
});
