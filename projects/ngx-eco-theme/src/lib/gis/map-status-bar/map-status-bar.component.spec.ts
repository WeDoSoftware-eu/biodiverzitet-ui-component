import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { MapStatusBarComponent } from './map-status-bar.component';
import { MapCoordinates } from './map-status-bar.model';

describe('MapStatusBarComponent', () => {
  let component: MapStatusBarComponent;
  let componentRef: ComponentRef<MapStatusBarComponent>;
  let fixture: ComponentFixture<MapStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapStatusBarComponent],
    })
      .overrideComponent(MapStatusBarComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MapStatusBarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default EPSG code', () => {
    const el = fixture.nativeElement.querySelector('.epsg-code');
    expect(el.textContent).toContain('EPSG:32634');
  });

  it('should display custom EPSG code', () => {
    componentRef.setInput('epsgCode', 'EPSG:4326');
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.epsg-code');
    expect(el.textContent).toContain('EPSG:4326');
  });

  it('should show dash placeholder when coordinates are null', () => {
    const el = fixture.nativeElement.querySelector('.coordinates');
    expect(el.textContent).toContain('-, -');
    expect(el.classList).toContain('coordinates--empty');
  });

  it('should display formatted coordinates when provided', () => {
    const coords: MapCoordinates = { easting: 500000, northing: 4800000 };
    componentRef.setInput('coordinates', coords);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.coordinates');
    expect(el.textContent).toContain('N');
    expect(el.textContent).toContain('E');
    expect(el.classList).not.toContain('coordinates--empty');
  });

  it('should format easting with sr-RS locale', () => {
    const coords: MapCoordinates = { easting: 500123, northing: 4800000 };
    componentRef.setInput('coordinates', coords);
    fixture.detectChanges();

    const formatted = component.formattedEasting();
    expect(formatted).toContain('500.123');
    expect(formatted).toContain('E');
  });

  it('should format northing with sr-RS locale', () => {
    const coords: MapCoordinates = { easting: 500000, northing: 4800456 };
    componentRef.setInput('coordinates', coords);
    fixture.detectChanges();

    const formatted = component.formattedNorthing();
    expect(formatted).toContain('4.800.456');
    expect(formatted).toContain('N');
  });

  it('should calculate scale bar in meters for low resolution', () => {
    componentRef.setInput('resolution', 1);
    fixture.detectChanges();

    const config = component.scaleBarConfig();
    expect(config.unit).toBe('m');
    expect(config.scaleValue).toBeGreaterThan(0);
    expect(config.widthPx).toBeGreaterThan(0);
    expect(config.label).toContain('m');
  });

  it('should calculate scale bar in km for high resolution', () => {
    componentRef.setInput('resolution', 100);
    fixture.detectChanges();

    const config = component.scaleBarConfig();
    expect(config.unit).toBe('km');
    expect(config.scaleValue).toBeGreaterThan(0);
    expect(config.label).toContain('km');
  });

  it('should display scale bar label in template', () => {
    componentRef.setInput('resolution', 10);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.scale-label');
    expect(label.textContent.trim()).toBe(component.scaleBarConfig().label);
  });

  it('should set scale line width from scaleBarConfig', () => {
    componentRef.setInput('resolution', 10);
    fixture.detectChanges();

    const scaleLine = fixture.nativeElement.querySelector('.scale-line');
    const expectedWidth = component.scaleBarConfig().widthPx;
    expect(scaleLine.style.width).toBe(`${expectedWidth}px`);
  });
});
