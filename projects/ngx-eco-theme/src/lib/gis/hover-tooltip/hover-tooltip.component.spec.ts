import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoverTooltipComponent } from './hover-tooltip.component';
import { HoverFeatureInfo, HoverTooltipData } from './hover-tooltip.model';

describe('HoverTooltipComponent', () => {
  const TOOLTIP_SELECTOR = '.hover-tooltip';
  const FEATURE_LABEL = '.feature-label';

  let component: HoverTooltipComponent;
  let fixture: ComponentFixture<HoverTooltipComponent>;

  const mockFeature: HoverFeatureInfo = {
    layerId: 'layer-1',
    layerDisplayName: 'Заштићена подручја',
    featureName: 'Делиблатска пешчара',
    featureType: 'Парк природе',
    registrationNumber: 'ЗП-001',
  };

  const mockFeatureMinimal: HoverFeatureInfo = {
    layerId: 'layer-2',
    layerDisplayName: 'Станишта',
    featureName: null,
    featureType: null,
    registrationNumber: null,
  };

  const mockData: HoverTooltipData = {
    features: [mockFeature],
    position: { x: 150, y: 200 },
    showAbove: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverTooltipComponent],
    })
      .overrideComponent(HoverTooltipComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HoverTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render tooltip when data is null', () => {
    const tooltip = fixture.nativeElement.querySelector(TOOLTIP_SELECTOR);
    expect(tooltip).toBeNull();
  });

  it('should render tooltip when data is provided', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector(TOOLTIP_SELECTOR);
    expect(tooltip).toBeTruthy();
  });

  it('should position tooltip using inline styles', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector(TOOLTIP_SELECTOR) as HTMLElement;
    expect(tooltip.style.left).toBe('150px');
    expect(tooltip.style.top).toBe('200px');
  });

  it('should add above class when showAbove is true', () => {
    fixture.componentRef.setInput('data', { ...mockData, showAbove: true });
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector(TOOLTIP_SELECTOR);
    expect(tooltip.classList.contains('above')).toBeTrue();
    expect(tooltip.classList.contains('below')).toBeFalse();
  });

  it('should add below class when showAbove is false', () => {
    fixture.componentRef.setInput('data', { ...mockData, showAbove: false });
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector(TOOLTIP_SELECTOR);
    expect(tooltip.classList.contains('below')).toBeTrue();
    expect(tooltip.classList.contains('above')).toBeFalse();
  });

  it('should render feature sections for each feature', () => {
    fixture.componentRef.setInput('data', {
      ...mockData,
      features: [mockFeature, mockFeatureMinimal],
    });
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.feature-section');
    expect(sections.length).toBe(2);
  });

  it('should display layer name for each feature', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const layerName = fixture.nativeElement.querySelector('.layer-name');
    expect(layerName.textContent).toContain('Заштићена подручја');
  });

  it('should display feature name when provided', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const rows: Element[] = Array.from(fixture.nativeElement.querySelectorAll('.feature-row'));
    const nameRow = rows.find(
      row => row.querySelector(FEATURE_LABEL)?.textContent?.trim() === 'Назив:'
    );
    expect(nameRow).toBeTruthy();
    expect(nameRow!.querySelector('.feature-value')?.textContent).toContain('Делиблатска пешчара');
  });

  it('should not display feature name row when featureName is null', () => {
    fixture.componentRef.setInput('data', { ...mockData, features: [mockFeatureMinimal] });
    fixture.detectChanges();

    const labels: Element[] = Array.from(fixture.nativeElement.querySelectorAll(FEATURE_LABEL));
    const hasNameLabel = labels.some(label => label.textContent?.trim() === 'Назив:');
    expect(hasNameLabel).toBeFalse();
  });

  it('should display feature type when provided', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const rows: Element[] = Array.from(fixture.nativeElement.querySelectorAll('.feature-row'));
    const typeRow = rows.find(
      row => row.querySelector(FEATURE_LABEL)?.textContent?.trim() === 'Тип:'
    );
    expect(typeRow).toBeTruthy();
    expect(typeRow!.querySelector('.feature-value')?.textContent).toContain('Парк природе');
  });

  it('should not display feature type row when featureType is null', () => {
    fixture.componentRef.setInput('data', { ...mockData, features: [mockFeatureMinimal] });
    fixture.detectChanges();

    const labels: Element[] = Array.from(fixture.nativeElement.querySelectorAll(FEATURE_LABEL));
    const hasTypeLabel = labels.some(label => label.textContent?.trim() === 'Тип:');
    expect(hasTypeLabel).toBeFalse();
  });

  it('should display registration number when provided', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const regNumber = fixture.nativeElement.querySelector('.feature-reg-number');
    expect(regNumber).toBeTruthy();
    expect(regNumber.textContent).toContain('ЗП-001');
  });

  it('should not display registration number row when registrationNumber is null', () => {
    fixture.componentRef.setInput('data', { ...mockData, features: [mockFeatureMinimal] });
    fixture.detectChanges();

    const regNumber = fixture.nativeElement.querySelector('.feature-reg-number');
    expect(regNumber).toBeNull();
  });

  it('should render tooltip arrow', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    const arrow = fixture.nativeElement.querySelector('.tooltip-arrow');
    expect(arrow).toBeTruthy();
  });

  it('should hide tooltip when data is set back to null', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(TOOLTIP_SELECTOR)).toBeTruthy();

    fixture.componentRef.setInput('data', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector(TOOLTIP_SELECTOR)).toBeNull();
  });
});
