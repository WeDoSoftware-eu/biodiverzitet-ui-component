import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MapControlsComponent } from './map-controls.component';

describe('MapControlsComponent', () => {
  const ZOOM_IN_SELECTOR = '[aria-label="Zoom in"]';

  let component: MapControlsComponent;
  let fixture: ComponentFixture<MapControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapControlsComponent],
    })
      .overrideComponent(MapControlsComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MapControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 4 control buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.control-btn');
    expect(buttons.length).toBe(4);
  });

  it('should render a divider between button groups', () => {
    const divider = fixture.nativeElement.querySelector('.divider');
    expect(divider).toBeTruthy();
  });

  it('should render SVG icons inside all buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.control-btn');
    buttons.forEach((button: HTMLElement) => {
      expect(button.querySelector('svg')).toBeTruthy();
    });
  });

  it('should have correct aria-label on zoom in button', () => {
    const button = fixture.nativeElement.querySelector(ZOOM_IN_SELECTOR);
    expect(button).toBeTruthy();
  });

  it('should have correct aria-label on zoom out button', () => {
    const button = fixture.nativeElement.querySelector('[aria-label="Zoom out"]');
    expect(button).toBeTruthy();
  });

  it('should have correct aria-label on home view button', () => {
    const button = fixture.nativeElement.querySelector('[aria-label="Početni pogled"]');
    expect(button).toBeTruthy();
  });

  it('should have correct aria-label on fullscreen button', () => {
    const button = fixture.nativeElement.querySelector('[aria-label="Fullscreen"]');
    expect(button).toBeTruthy();
  });

  it('should emit zoomIn when onZoomIn is called', () => {
    let emitted = false;
    component.zoomIn.subscribe(() => {
      emitted = true;
    });

    component.onZoomIn();

    expect(emitted).toBeTrue();
  });

  it('should emit zoomOut when onZoomOut is called', () => {
    let emitted = false;
    component.zoomOut.subscribe(() => {
      emitted = true;
    });

    component.onZoomOut();

    expect(emitted).toBeTrue();
  });

  it('should emit fullscreen when onFullscreen is called', () => {
    let emitted = false;
    component.fullscreen.subscribe(() => {
      emitted = true;
    });

    component.onFullscreen();

    expect(emitted).toBeTrue();
  });

  it('should emit homeViewClick when onHomeViewClick is called', () => {
    let emitted = false;
    component.homeViewClick.subscribe(() => {
      emitted = true;
    });

    component.onHomeViewClick();

    expect(emitted).toBeTrue();
  });

  it('should emit zoomIn when zoom in button is clicked', () => {
    let emitted = false;
    component.zoomIn.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector(ZOOM_IN_SELECTOR);
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should emit zoomOut when zoom out button is clicked', () => {
    let emitted = false;
    component.zoomOut.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('[aria-label="Zoom out"]');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should emit fullscreen when fullscreen button is clicked', () => {
    let emitted = false;
    component.fullscreen.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('[aria-label="Fullscreen"]');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should emit homeViewClick when home view button is clicked', () => {
    let emitted = false;
    component.homeViewClick.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('[aria-label="Početni pogled"]');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should set zoomInClicked to true after onZoomIn', () => {
    component.onZoomIn();
    expect(component.zoomInClicked()).toBeTrue();
  });

  it('should reset zoomInClicked to false after timeout', fakeAsync(() => {
    component.onZoomIn();
    expect(component.zoomInClicked()).toBeTrue();

    tick(1000);

    expect(component.zoomInClicked()).toBeFalse();
  }));

  it('should set zoomOutClicked to true after onZoomOut', () => {
    component.onZoomOut();
    expect(component.zoomOutClicked()).toBeTrue();
  });

  it('should reset zoomOutClicked to false after timeout', fakeAsync(() => {
    component.onZoomOut();
    expect(component.zoomOutClicked()).toBeTrue();

    tick(1000);

    expect(component.zoomOutClicked()).toBeFalse();
  }));

  it('should set homeViewClicked to true after onHomeViewClick', () => {
    component.onHomeViewClick();
    expect(component.homeViewClicked()).toBeTrue();
  });

  it('should reset homeViewClicked to false after timeout', fakeAsync(() => {
    component.onHomeViewClick();
    expect(component.homeViewClicked()).toBeTrue();

    tick(1000);

    expect(component.homeViewClicked()).toBeFalse();
  }));

  it('should add clicked class to zoom in button after click', () => {
    component.onZoomIn();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(ZOOM_IN_SELECTOR);
    expect(button.classList.contains('clicked')).toBeTrue();
  });

  it('should remove clicked class from zoom in button after timeout', fakeAsync(() => {
    component.onZoomIn();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(ZOOM_IN_SELECTOR);
    expect(button.classList.contains('clicked')).toBeTrue();

    tick(1000);
    fixture.detectChanges();

    expect(button.classList.contains('clicked')).toBeFalse();
  }));
});
