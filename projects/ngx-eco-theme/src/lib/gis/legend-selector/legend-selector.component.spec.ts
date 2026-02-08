import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { LegendSelectorComponent } from './legend-selector.component';
import { LegendItem } from './legend.model';

describe('LegendSelectorComponent', () => {
  let component: LegendSelectorComponent;
  let componentRef: ComponentRef<LegendSelectorComponent>;
  let fixture: ComponentFixture<LegendSelectorComponent>;

  const mockItems: LegendItem[] = [
    { id: '1', name: 'Forest', type: 'fill', color: '#228B22', strokeColor: '#006400' },
    { id: '2', name: 'River', type: 'line', color: '#0000FF', strokeWidth: 3 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendSelectorComponent],
    })
      .overrideComponent(LegendSelectorComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LegendSelectorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Легенда');
  });

  it('should display custom title', () => {
    componentRef.setInput('title', 'Custom Legend');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Custom Legend');
  });

  it('should render legend items', () => {
    componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.legend-item');
    expect(items.length).toBe(2);
  });

  it('should show empty state when no items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const noItems = compiled.querySelector('.no-items');
    expect(noItems?.textContent).toContain('Нема ставки у легенди');
  });

  it('should emit closeSelector on close button click', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('.close-button');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should render fill type item', () => {
    componentRef.setInput('items', [mockItems[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const fillSymbol = compiled.querySelector('.symbol-fill') as HTMLElement;
    expect(fillSymbol).toBeTruthy();
    expect(fillSymbol.style.backgroundColor).toBeTruthy();
  });

  it('should render line type item', () => {
    componentRef.setInput('items', [mockItems[1]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const lineSymbol = compiled.querySelector('.symbol-line');
    expect(lineSymbol).toBeTruthy();
  });

  it('should trackByItemId return item id', () => {
    const item: LegendItem = { id: 'test-id', name: 'Test', type: 'fill' };
    expect(component.trackByItemId(0, item)).toBe('test-id');
  });
});
