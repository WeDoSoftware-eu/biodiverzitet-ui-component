import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { UtmLegendComponent } from './utm-legend.component';
import { UtmLegendItem } from './utm-legend.model';

describe('UtmLegendComponent', () => {
  const CLOSE_BUTTON = '.close-button';
  const LEGEND_ITEM = '.legend-item';
  const LEGEND_NAME = '.legend-name';
  const NO_ITEMS = '.no-items';
  const ARIA_LABEL = 'aria-label';
  const SYMBOL_OVERLAP = '.symbol-overlap';

  let component: UtmLegendComponent;
  let componentRef: ComponentRef<UtmLegendComponent>;
  let fixture: ComponentFixture<UtmLegendComponent>;

  const mockItems: UtmLegendItem[] = [
    { name: 'Ботаника', color: '#228B22', isOverlap: false },
    { name: 'Птице', color: '#4169E1', isOverlap: false },
  ];

  const mockOverlapItem: UtmLegendItem = {
    name: 'Преклапање (2+ група)',
    color: '#808080',
    isOverlap: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtmLegendComponent],
    })
      .overrideComponent(UtmLegendComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UtmLegendComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  // --- Creation & Defaults ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Легенда');
  });

  it('should display custom title when provided', () => {
    componentRef.setInput('title', 'Custom Legend');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Custom Legend');
  });

  // --- Close Button ---

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

    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON);
    closeButton.click();

    expect(emitted).toBeTrue();
  });

  it('should have close button with aria-label', () => {
    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON);
    expect(closeButton.getAttribute(ARIA_LABEL)).toBe('Затвори');
  });

  // --- Legend Items Rendering ---

  it('should render legend items', () => {
    componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll(LEGEND_ITEM);
    expect(items.length).toBe(2);
  });

  it('should display item names', () => {
    componentRef.setInput('items', [mockItems[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const name = compiled.querySelector(LEGEND_NAME);
    expect(name?.textContent).toContain('Ботаника');
  });

  it('should render fill symbol for non-overlap items', () => {
    componentRef.setInput('items', [mockItems[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const fillSymbol = compiled.querySelector('.symbol-fill') as HTMLElement;
    expect(fillSymbol).toBeTruthy();
    expect(fillSymbol.style.backgroundColor).toBeTruthy();
  });

  it('should render overlap symbol for overlap items', () => {
    componentRef.setInput('items', [mockOverlapItem]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const overlapSymbol = compiled.querySelector(SYMBOL_OVERLAP);
    expect(overlapSymbol).toBeTruthy();
  });

  it('should not render overlap symbol for regular items', () => {
    componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const overlapSymbol = compiled.querySelector(SYMBOL_OVERLAP);
    expect(overlapSymbol).toBeNull();
  });

  // --- Empty State ---

  it('should show empty state when no items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const noItems = compiled.querySelector(NO_ITEMS);
    expect(noItems?.textContent).toContain('Нема активних филтера');
  });

  it('should not show empty state when items are provided', () => {
    componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const noItems = compiled.querySelector(NO_ITEMS);
    expect(noItems).toBeNull();
  });

  // --- Mixed Items ---

  it('should render both regular and overlap items together', () => {
    componentRef.setInput('items', [...mockItems, mockOverlapItem]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll(LEGEND_ITEM);
    expect(items.length).toBe(3);

    const fillSymbols = compiled.querySelectorAll('.symbol-fill');
    expect(fillSymbols.length).toBe(2);

    const overlapSymbols = compiled.querySelectorAll('.symbol-overlap');
    expect(overlapSymbols.length).toBe(1);
  });
});
