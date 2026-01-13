import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadButtonComponent } from './download-button.component';

const BUTTON_SELECTOR = '.download-button';

describe('DownloadButtonComponent', () => {
  let component: DownloadButtonComponent;
  let fixture: ComponentFixture<DownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit buttonClick when clicked', () => {
    const buttonClickSpy = spyOn(component.buttonClick, 'emit');

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    button.click();

    expect(buttonClickSpy).toHaveBeenCalled();
  });

  it('should emit buttonClick when onClick method is called', () => {
    const buttonClickSpy = spyOn(component.buttonClick, 'emit');

    component.onClick();

    expect(buttonClickSpy).toHaveBeenCalled();
  });

  it('should apply "active" class when isActive is true', () => {
    component.isActive = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.classList.contains('active')).toBeTrue();
  });

  it('should not have "active" class when isActive is false', () => {
    component.isActive = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.classList.contains('active')).toBeFalse();
  });

  it('should have isActive default to false', () => {
    expect(component.isActive).toBeFalse();
  });

  it('should render SVG icon', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have correct accessibility attributes', () => {
    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.getAttribute('aria-label')).toBe('Download');
    expect(button.getAttribute('title')).toBe('Download');
  });
});
