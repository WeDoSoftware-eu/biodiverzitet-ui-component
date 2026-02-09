import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { MeasurementPanelComponent } from './measurement-panel.component';
import { MeasurementItem, MeasurementType } from './measurement.model';

describe('MeasurementPanelComponent', () => {
  const TAB_BUTTON = '.tab-button';
  const MEASUREMENT_ITEM = '.measurement-item';
  const STOP_BUTTON = '.stop-button';
  const ADD_BUTTON = '.add-button';

  let component: MeasurementPanelComponent;
  let componentRef: ComponentRef<MeasurementPanelComponent>;
  let fixture: ComponentFixture<MeasurementPanelComponent>;

  const mockPointMeasurement: MeasurementItem = {
    id: 1,
    type: 'point',
    label: 'Тачка 1',
    value: '44.7866° N, 20.4489° E',
  };

  const mockLineMeasurement: MeasurementItem = {
    id: 2,
    type: 'line',
    label: 'Линија 1',
    value: '1.234 km',
  };

  const mockPolygonMeasurement: MeasurementItem = {
    id: 3,
    type: 'polygon',
    label: 'Полигон 1',
    value: '5.678 km²',
  };

  const mockMeasurements: MeasurementItem[] = [
    mockPointMeasurement,
    mockLineMeasurement,
    mockPolygonMeasurement,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementPanelComponent],
    })
      .overrideComponent(MeasurementPanelComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MeasurementPanelComponent);
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
    expect(compiled.querySelector('.title')?.textContent).toContain('Мерење');
  });

  // --- Title Input ---

  it('should display custom title when provided', () => {
    componentRef.setInput('title', 'Custom Title');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Custom Title');
  });

  // --- Close Button ---

  it('should emit closePanel when onClose is called', () => {
    let emitted = false;
    component.closePanel.subscribe(() => {
      emitted = true;
    });

    component.onClose();

    expect(emitted).toBeTrue();
  });

  it('should emit closePanel when close button is clicked', () => {
    let emitted = false;
    component.closePanel.subscribe(() => {
      emitted = true;
    });

    const button = fixture.nativeElement.querySelector('.close-button');
    button.click();

    expect(emitted).toBeTrue();
  });

  it('should render close button with correct aria-label', () => {
    const button = fixture.nativeElement.querySelector('.close-button');
    expect(button.getAttribute('aria-label')).toBe('Затвори');
  });

  // --- Tabs ---

  it('should render three tab buttons', () => {
    const tabs = fixture.nativeElement.querySelectorAll(TAB_BUTTON);
    expect(tabs.length).toBe(3);
  });

  it('should render tab labels in Serbian', () => {
    const labels = fixture.nativeElement.querySelectorAll('.tab-label');
    expect(labels[0].textContent).toContain('Тачка');
    expect(labels[1].textContent).toContain('Линија');
    expect(labels[2].textContent).toContain('Полигон');
  });

  it('should render SVG icon inside each tab', () => {
    const tabs = fixture.nativeElement.querySelectorAll(TAB_BUTTON);
    tabs.forEach((tab: Element) => {
      const svg = tab.querySelector('.tab-icon svg');
      expect(svg).toBeTruthy();
    });
  });

  it('should have active class on point tab by default', () => {
    const tabs = fixture.nativeElement.querySelectorAll(TAB_BUTTON);
    expect(tabs[0].classList.contains('active')).toBeTrue();
    expect(tabs[1].classList.contains('active')).toBeFalse();
    expect(tabs[2].classList.contains('active')).toBeFalse();
  });

  // --- Tab Change ---

  it('should emit tabChange when onTabChange is called', () => {
    let emittedValue: MeasurementType | undefined;
    component.tabChange.subscribe((value: MeasurementType) => {
      emittedValue = value;
    });

    component.onTabChange('line');

    expect(emittedValue).toBe('line');
  });

  it('should emit tabChange when a tab button is clicked', () => {
    let emittedValue: MeasurementType | undefined;
    component.tabChange.subscribe((value: MeasurementType) => {
      emittedValue = value;
    });

    const tabs = fixture.nativeElement.querySelectorAll(TAB_BUTTON);
    tabs[1].click();

    expect(emittedValue).toBe('line');
  });

  it('should apply active class to selected tab when activeTab changes', () => {
    componentRef.setInput('activeTab', 'polygon');
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll(TAB_BUTTON);
    expect(tabs[0].classList.contains('active')).toBeFalse();
    expect(tabs[1].classList.contains('active')).toBeFalse();
    expect(tabs[2].classList.contains('active')).toBeTrue();
  });

  // --- Measurement List ---

  it('should render measurement items for the active tab', () => {
    componentRef.setInput('measurements', mockMeasurements);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll(MEASUREMENT_ITEM);
    expect(items.length).toBe(1);
  });

  it('should display measurement label and value', () => {
    componentRef.setInput('measurements', [mockPointMeasurement]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('.measurement-label');
    const value = compiled.querySelector('.measurement-value');

    expect(label?.textContent).toContain('Тачка 1');
    expect(value?.textContent).toContain('44.7866° N, 20.4489° E');
  });

  it('should render measurement icon SVG for each item', () => {
    componentRef.setInput('measurements', [mockPointMeasurement]);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('.measurement-icon svg');
    expect(svg).toBeTruthy();
  });

  it('should show correct items when activeTab changes', () => {
    componentRef.setInput('measurements', mockMeasurements);
    componentRef.setInput('activeTab', 'line');
    fixture.detectChanges();

    let items = fixture.nativeElement.querySelectorAll(MEASUREMENT_ITEM);
    expect(items.length).toBe(1);

    componentRef.setInput('activeTab', 'polygon');
    fixture.detectChanges();

    items = fixture.nativeElement.querySelectorAll(MEASUREMENT_ITEM);
    expect(items.length).toBe(1);
  });

  // --- filteredMeasurements ---

  it('should return only measurements matching the active tab type', () => {
    componentRef.setInput('measurements', mockMeasurements);
    componentRef.setInput('activeTab', 'point');
    fixture.detectChanges();

    const filtered = component.filteredMeasurements;
    expect(filtered.length).toBe(1);
    expect(filtered[0].type).toBe('point');
  });

  it('should return empty array when no measurements match active tab', () => {
    componentRef.setInput('measurements', [mockPointMeasurement]);
    componentRef.setInput('activeTab', 'line');
    fixture.detectChanges();

    const filtered = component.filteredMeasurements;
    expect(filtered.length).toBe(0);
  });

  // --- Delete ---

  it('should emit deleteMeasurement with item id when onDelete is called', () => {
    let emittedValue: number | undefined;
    component.deleteMeasurement.subscribe((value: number) => {
      emittedValue = value;
    });

    component.onDelete(42);

    expect(emittedValue).toBe(42);
  });

  it('should emit deleteMeasurement when delete button is clicked', () => {
    componentRef.setInput('measurements', [mockPointMeasurement]);
    fixture.detectChanges();

    let emittedValue: number | undefined;
    component.deleteMeasurement.subscribe((value: number) => {
      emittedValue = value;
    });

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    deleteButton.click();

    expect(emittedValue).toBe(1);
  });

  it('should render delete button with correct aria-label', () => {
    componentRef.setInput('measurements', [mockPointMeasurement]);
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    expect(deleteButton.getAttribute('aria-label')).toBe('Обриши');
  });

  // --- trackByItemId ---

  it('should return item id from trackByItemId', () => {
    expect(component.trackByItemId(0, mockPointMeasurement)).toBe(1);
    expect(component.trackByItemId(1, mockLineMeasurement)).toBe(2);
  });

  // --- Empty State ---

  it('should show empty state message when no measurements and not drawing', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const noItems = compiled.querySelector('.no-items');
    expect(noItems).toBeTruthy();
    expect(noItems?.textContent).toContain('Нема мерења');
  });

  it('should not show empty state when isDrawing is true', () => {
    componentRef.setInput('isDrawing', true);
    fixture.detectChanges();

    const noItems = fixture.nativeElement.querySelector('.no-items');
    expect(noItems).toBeNull();
  });

  // --- Drawing State ---

  it('should show drawing indicator when isDrawing is true', () => {
    componentRef.setInput('isDrawing', true);
    fixture.detectChanges();

    const indicator = fixture.nativeElement.querySelector('.drawing-indicator');
    expect(indicator).toBeTruthy();
    expect(indicator.textContent).toContain('Цртање у току...');
  });

  it('should not show drawing indicator when isDrawing is false', () => {
    const indicator = fixture.nativeElement.querySelector('.drawing-indicator');
    expect(indicator).toBeNull();
  });

  // --- Footer Buttons ---

  it('should show stop button when isDrawing is true', () => {
    componentRef.setInput('isDrawing', true);
    fixture.detectChanges();

    const stopButton = fixture.nativeElement.querySelector(STOP_BUTTON);
    const addButton = fixture.nativeElement.querySelector(ADD_BUTTON);

    expect(stopButton).toBeTruthy();
    expect(stopButton.textContent).toContain('Заустави');
    expect(addButton).toBeNull();
  });

  it('should show add new button when isDrawing is false', () => {
    const stopButton = fixture.nativeElement.querySelector(STOP_BUTTON);
    const addButton = fixture.nativeElement.querySelector(ADD_BUTTON);

    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toContain('Додај ново');
    expect(stopButton).toBeNull();
  });

  it('should emit stopDrawing when stop button is clicked', () => {
    componentRef.setInput('isDrawing', true);
    fixture.detectChanges();

    let emitted = false;
    component.stopDrawing.subscribe(() => {
      emitted = true;
    });

    const stopButton = fixture.nativeElement.querySelector(STOP_BUTTON);
    stopButton.click();

    expect(emitted).toBeTrue();
  });

  it('should emit addNew when add new button is clicked', () => {
    let emitted = false;
    component.addNew.subscribe(() => {
      emitted = true;
    });

    const addButton = fixture.nativeElement.querySelector(ADD_BUTTON);
    addButton.click();

    expect(emitted).toBeTrue();
  });
});
