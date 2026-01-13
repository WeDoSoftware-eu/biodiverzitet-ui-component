import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseLayerButtonComponent } from './base-layer-button.component';

describe('BaseLayerButtonComponent', () => {
  let component: BaseLayerButtonComponent;
  let fixture: ComponentFixture<BaseLayerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseLayerButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseLayerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit buttonClick when clicked', () => {
    const buttonClickSpy = spyOn(component.buttonClick, 'emit');

    const button = fixture.nativeElement.querySelector('.control-button');
    button.click();

    expect(buttonClickSpy).toHaveBeenCalled();
  });

  it('should emit buttonClick when onClick method is called', () => {
    const buttonClickSpy = spyOn(component.buttonClick, 'emit');

    component.onClick();

    expect(buttonClickSpy).toHaveBeenCalled();
  });

  it('should render SVG icon', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('should have correct accessibility attributes', () => {
    const button = fixture.nativeElement.querySelector('.control-button');
    expect(button.getAttribute('aria-label')).toBe('Osnovni slojevi mape');
    expect(button.getAttribute('title')).toBe('Podloge');
  });
});
