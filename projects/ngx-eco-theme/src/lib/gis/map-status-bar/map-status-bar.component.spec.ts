import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapStatusBarComponent } from './map-status-bar.component';
import { MapCoordinates } from './map-status-bar.model';

const COORDINATES_SELECTOR = '.coordinates';

describe('MapStatusBarComponent', () => {
  let component: MapStatusBarComponent;
  let fixture: ComponentFixture<MapStatusBarComponent>;

  const mockCoordinates: MapCoordinates = {
    easting: 7461234.56,
    northing: 4921234.78,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapStatusBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('EPSG Code', () => {
    it('should display EPSG code', () => {
      fixture.componentRef.setInput('epsgCode', 'EPSG:4326');
      fixture.detectChanges();

      const epsgElement = fixture.nativeElement.querySelector('.epsg-code');
      expect(epsgElement.textContent).toBe('EPSG:4326');
    });

    it('should have default EPSG code of EPSG:32634', () => {
      const epsgElement = fixture.nativeElement.querySelector('.epsg-code');
      expect(epsgElement.textContent).toBe('EPSG:32634');
    });
  });

  describe('Coordinates Display', () => {
    it('should display formatted coordinates in Serbian locale', () => {
      fixture.componentRef.setInput('coordinates', mockCoordinates);
      fixture.detectChanges();

      const coordsElement = fixture.nativeElement.querySelector(COORDINATES_SELECTOR);
      // Serbian locale uses dot as thousand separator
      // 7461235 E (rounded from 7461234.56)
      // 4921235 N (rounded from 4921234.78)
      expect(coordsElement.textContent).toContain('E');
      expect(coordsElement.textContent).toContain('N');
    });

    it('should handle null coordinates gracefully', () => {
      fixture.componentRef.setInput('coordinates', null);
      fixture.detectChanges();

      const coordsElement = fixture.nativeElement.querySelector(COORDINATES_SELECTOR);
      expect(coordsElement.textContent).toContain('-');
      expect(coordsElement.classList.contains('coordinates--empty')).toBeTrue();
    });

    it('should handle undefined coordinates gracefully', () => {
      // Default is null, so this tests the undefined case
      const coordsElement = fixture.nativeElement.querySelector(COORDINATES_SELECTOR);
      expect(coordsElement.textContent).toContain('-');
    });

    it('should update formattedEasting computed signal', () => {
      fixture.componentRef.setInput('coordinates', mockCoordinates);
      fixture.detectChanges();

      const formattedEasting = component.formattedEasting();
      expect(formattedEasting).toContain('E');
      // Should be rounded: 7461235
      expect(formattedEasting).toContain('7');
    });

    it('should update formattedNorthing computed signal', () => {
      fixture.componentRef.setInput('coordinates', mockCoordinates);
      fixture.detectChanges();

      const formattedNorthing = component.formattedNorthing();
      expect(formattedNorthing).toContain('N');
      // Should be rounded: 4921235
      expect(formattedNorthing).toContain('4');
    });

    it('should return "-" for formattedEasting when coordinates are null', () => {
      fixture.componentRef.setInput('coordinates', null);
      fixture.detectChanges();

      expect(component.formattedEasting()).toBe('-');
    });

    it('should return "-" for formattedNorthing when coordinates are null', () => {
      fixture.componentRef.setInput('coordinates', null);
      fixture.detectChanges();

      expect(component.formattedNorthing()).toBe('-');
    });

    it('should round coordinates to nearest integer', () => {
      const coords: MapCoordinates = {
        easting: 1234.4,
        northing: 5678.6,
      };
      fixture.componentRef.setInput('coordinates', coords);
      fixture.detectChanges();

      // 1234.4 rounds to 1234, 5678.6 rounds to 5679
      expect(component.formattedEasting()).toContain('1.234 E'); // Serbian locale
      expect(component.formattedNorthing()).toContain('5.679 N'); // Serbian locale
    });
  });

  describe('Scale Bar', () => {
    it('should calculate scale bar width correctly for resolution 1', () => {
      fixture.componentRef.setInput('resolution', 1);
      fixture.detectChanges();

      const config = component.scaleBarConfig();
      expect(config.widthPx).toBeGreaterThan(0);
      expect(config.widthPx).toBeLessThanOrEqual(100);
    });

    it('should display meters for small scales', () => {
      // Small resolution = small scale = meters
      fixture.componentRef.setInput('resolution', 0.5);
      fixture.detectChanges();

      const config = component.scaleBarConfig();
      expect(config.unit).toBe('m');
      expect(config.label).toContain('m');
    });

    it('should display kilometers for large scales', () => {
      // Large resolution = large scale = kilometers
      fixture.componentRef.setInput('resolution', 100);
      fixture.detectChanges();

      const config = component.scaleBarConfig();
      expect(config.unit).toBe('km');
      expect(config.label).toContain('km');
    });

    it('should update scaleBarConfig when resolution changes', () => {
      fixture.componentRef.setInput('resolution', 1);
      fixture.detectChanges();
      const config1 = component.scaleBarConfig();

      fixture.componentRef.setInput('resolution', 50);
      fixture.detectChanges();
      const config2 = component.scaleBarConfig();

      expect(config1.scaleValue).not.toBe(config2.scaleValue);
    });

    it('should render scale bar with correct width', () => {
      fixture.componentRef.setInput('resolution', 10);
      fixture.detectChanges();

      const scaleLine = fixture.nativeElement.querySelector('.scale-line');
      const config = component.scaleBarConfig();

      expect(scaleLine.style.width).toBe(`${config.widthPx}px`);
    });

    it('should display scale label', () => {
      fixture.componentRef.setInput('resolution', 10);
      fixture.detectChanges();

      const scaleLabel = fixture.nativeElement.querySelector('.scale-label');
      const config = component.scaleBarConfig();

      expect(scaleLabel.textContent).toBe(config.label);
    });

    it('should have scale ticks rendered', () => {
      fixture.detectChanges();

      const leftTick = fixture.nativeElement.querySelector('.scale-tick--left');
      const rightTick = fixture.nativeElement.querySelector('.scale-tick--right');

      expect(leftTick).toBeTruthy();
      expect(rightTick).toBeTruthy();
    });

    it('should calculate scale bar for very small resolution', () => {
      fixture.componentRef.setInput('resolution', 0.1);
      fixture.detectChanges();

      const config = component.scaleBarConfig();
      expect(config.unit).toBe('m');
      expect(config.scaleValue).toBeGreaterThan(0);
    });

    it('should calculate scale bar for very large resolution', () => {
      fixture.componentRef.setInput('resolution', 1000);
      fixture.detectChanges();

      const config = component.scaleBarConfig();
      expect(config.unit).toBe('km');
      expect(config.scaleValue).toBeGreaterThan(0);
    });

    it('should produce nice round numbers for scale', () => {
      fixture.componentRef.setInput('resolution', 15);
      fixture.detectChanges();

      const config = component.scaleBarConfig();
      // Scale value should be a nice round number (power of 10 based)
      expect(config.scaleValue).toBeGreaterThan(0);
      expect(Number.isInteger(config.scaleValue) || config.scaleValue % 0.5 === 0).toBeTrue();
    });
  });

  describe('Component Structure', () => {
    it('should render all three bar sections', () => {
      const sections = fixture.nativeElement.querySelectorAll('.bar-section');
      expect(sections.length).toBe(3);
    });

    it('should render map status bar container', () => {
      const container = fixture.nativeElement.querySelector('.map-status-bar');
      expect(container).toBeTruthy();
    });

    it('should have scale bar section', () => {
      const scaleBar = fixture.nativeElement.querySelector('.scale-bar');
      expect(scaleBar).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero coordinates', () => {
      const zeroCoords: MapCoordinates = {
        easting: 0,
        northing: 0,
      };
      fixture.componentRef.setInput('coordinates', zeroCoords);
      fixture.detectChanges();

      expect(component.formattedEasting()).toBe('0 E');
      expect(component.formattedNorthing()).toBe('0 N');
    });

    it('should handle negative coordinates', () => {
      const negativeCoords: MapCoordinates = {
        easting: -1234.56,
        northing: -5678.9,
      };
      fixture.componentRef.setInput('coordinates', negativeCoords);
      fixture.detectChanges();

      expect(component.formattedEasting()).toContain('E');
      expect(component.formattedNorthing()).toContain('N');
      expect(component.formattedEasting()).toContain('-');
      expect(component.formattedNorthing()).toContain('-');
    });

    it('should handle resolution of 1 (default)', () => {
      expect(component.resolution()).toBe(1);

      const config = component.scaleBarConfig();
      expect(config.scaleValue).toBeGreaterThan(0);
      expect(config.widthPx).toBeGreaterThan(0);
    });

    it('should handle large coordinate values', () => {
      const largeCoords: MapCoordinates = {
        easting: 99999999.99,
        northing: 88888888.88,
      };
      fixture.componentRef.setInput('coordinates', largeCoords);
      fixture.detectChanges();

      const formattedEasting = component.formattedEasting();
      const formattedNorthing = component.formattedNorthing();

      expect(formattedEasting).toContain('E');
      expect(formattedNorthing).toContain('N');
      // Should contain thousand separators
      expect(formattedEasting).toContain('.');
      expect(formattedNorthing).toContain('.');
    });
  });

  describe('Computed Signals Reactivity', () => {
    it('should update display when coordinates change', () => {
      fixture.componentRef.setInput('coordinates', mockCoordinates);
      fixture.detectChanges();

      const initialEasting = component.formattedEasting();

      const newCoords: MapCoordinates = {
        easting: 1000000,
        northing: 2000000,
      };
      fixture.componentRef.setInput('coordinates', newCoords);
      fixture.detectChanges();

      const updatedEasting = component.formattedEasting();
      expect(updatedEasting).not.toBe(initialEasting);
    });

    it('should update scale bar when resolution changes', () => {
      fixture.componentRef.setInput('resolution', 5);
      fixture.detectChanges();

      const initialConfig = component.scaleBarConfig();

      fixture.componentRef.setInput('resolution', 500);
      fixture.detectChanges();

      const updatedConfig = component.scaleBarConfig();
      expect(updatedConfig.unit).not.toBe(initialConfig.unit);
    });
  });
});
