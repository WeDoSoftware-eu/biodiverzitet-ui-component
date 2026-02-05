import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../eco-theme-I18n';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [{ provide: ECO_THEME_I18N, useValue: DEFAULT_ECO_THEME_I18N }],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.markers()).toEqual([]);
    expect(component.polygons()).toEqual([]);
    expect(component.center()).toEqual([51.505, -0.09]);
    expect(component.zoom()).toBe(13);
  });
});
