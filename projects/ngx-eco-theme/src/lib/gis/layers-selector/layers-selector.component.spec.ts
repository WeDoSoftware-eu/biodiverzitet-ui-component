import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayersSelectorComponent } from './layers-selector.component';
import { MapLayer, MapLayerGroup } from './layer.model';

const STANDALONE_LAYER_ITEM_SELECTOR = '.layers-list > .layer-item';
const CLOSE_BUTTON_SELECTOR = '.close-button';
const VISIBILITY_TOGGLE_SELECTOR = '.visibility-toggle';
const GROUP_LAYER_ITEM_SELECTOR = '.layer-group:first-child .group-layers .layer-item';
const NO_LAYERS_SELECTOR = '.no-layers';
const ARIA_LABEL_ATTR = 'aria-label';

describe('LayersSelectorComponent', () => {
  let component: LayersSelectorComponent;
  let fixture: ComponentFixture<LayersSelectorComponent>;

  const mockLayers: MapLayer[] = [
    { id: 'layer1', name: 'Layer 1', visible: true },
    { id: 'layer2', name: 'Layer 2', visible: false },
    { id: 'layer3', name: 'Layer 3', visible: true, type: 'wms', opacity: 0.8 },
  ];

  const mockGroups: MapLayerGroup[] = [
    {
      id: 'group1',
      name: 'Group 1',
      expanded: false,
      layers: [
        { id: 'g1-layer1', name: 'Group 1 Layer 1', visible: true },
        { id: 'g1-layer2', name: 'Group 1 Layer 2', visible: false },
      ],
    },
    {
      id: 'group2',
      name: 'Group 2',
      expanded: true,
      layers: [{ id: 'g2-layer1', name: 'Group 2 Layer 1', visible: true }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersSelectorComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title from input', () => {
    fixture.componentRef.setInput('title', 'Custom Title');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Custom Title');
  });

  it('should have default title in Serbian', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Слојеви');
  });

  it('should render layers from input', () => {
    fixture.componentRef.setInput('layers', mockLayers);
    fixture.detectChanges();

    const layerItems = fixture.nativeElement.querySelectorAll(STANDALONE_LAYER_ITEM_SELECTOR);
    expect(layerItems.length).toBe(3);

    const layerNames = fixture.nativeElement.querySelectorAll(
      '.layers-list > .layer-item .layer-name'
    );
    expect(layerNames[0].textContent).toBe('Layer 1');
    expect(layerNames[1].textContent).toBe('Layer 2');
    expect(layerNames[2].textContent).toBe('Layer 3');
  });

  it('should render groups from input', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll('.layer-group');
    expect(groups.length).toBe(2);

    const groupNames = fixture.nativeElement.querySelectorAll('.group-name');
    expect(groupNames[0].textContent).toBe('Group 1');
    expect(groupNames[1].textContent).toBe('Group 2');
  });

  it('should emit closeSelector when close button is clicked', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON_SELECTOR);
    closeButton.click();

    expect(emitted).toBeTrue();
  });

  it('should emit closeSelector when onClose method is called', () => {
    let emitted = false;
    component.closeSelector.subscribe(() => {
      emitted = true;
    });

    component.onClose();

    expect(emitted).toBeTrue();
  });

  it('should emit layerToggle with toggled visibility when layer is clicked', () => {
    fixture.componentRef.setInput('layers', mockLayers);
    fixture.detectChanges();

    let emittedLayer: MapLayer | null = null;
    component.layerToggle.subscribe(layer => {
      emittedLayer = layer;
    });

    const layerItems = fixture.nativeElement.querySelectorAll(STANDALONE_LAYER_ITEM_SELECTOR);
    layerItems[0].click();

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('layer1');
    expect(emittedLayer!.visible).toBeFalse(); // Was true, should toggle to false
  });

  it('should toggle visibility from false to true when layer is clicked', () => {
    fixture.componentRef.setInput('layers', mockLayers);
    fixture.detectChanges();

    let emittedLayer: MapLayer | null = null;
    component.layerToggle.subscribe(layer => {
      emittedLayer = layer;
    });

    const layerItems = fixture.nativeElement.querySelectorAll(STANDALONE_LAYER_ITEM_SELECTOR);
    layerItems[1].click(); // Layer 2 has visible: false

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('layer2');
    expect(emittedLayer!.visible).toBeTrue(); // Was false, should toggle to true
  });

  it('should emit layerToggle when onLayerToggle method is called', () => {
    const testLayer: MapLayer = { id: 'test', name: 'Test Layer', visible: true };

    let emittedLayer: MapLayer | null = null;
    component.layerToggle.subscribe(layer => {
      emittedLayer = layer;
    });

    component.onLayerToggle(testLayer);

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.visible).toBeFalse();
  });

  it('should toggle group expansion when group header is clicked', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    expect(component.isGroupExpanded('group1')).toBeFalse();

    const groupHeaders = fixture.nativeElement.querySelectorAll('.group-header');
    groupHeaders[0].click();
    fixture.detectChanges();

    expect(component.isGroupExpanded('group1')).toBeTrue();
  });

  it('should collapse expanded group when header is clicked again', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    // First expand
    component.toggleGroupExpanded('group1');
    expect(component.isGroupExpanded('group1')).toBeTrue();

    // Then collapse
    component.toggleGroupExpanded('group1');
    expect(component.isGroupExpanded('group1')).toBeFalse();
  });

  it('should show group content when expanded', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    // Expand group1
    component.toggleGroupExpanded('group1');
    fixture.detectChanges();

    const groupLayers = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEM_SELECTOR);
    expect(groupLayers.length).toBe(2);
  });

  it('should hide group content when collapsed', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    // Group1 should be collapsed by default
    const groupLayers = fixture.nativeElement.querySelectorAll(
      '.layer-group:first-child .group-layers'
    );
    expect(groupLayers.length).toBe(0);
  });

  it('should apply expanded class to arrow icon when group is expanded', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    const arrowIcon = fixture.nativeElement.querySelector('.layer-group:first-child .arrow-icon');
    expect(arrowIcon.classList.contains('expanded')).toBeFalse();

    component.toggleGroupExpanded('group1');
    fixture.detectChanges();

    expect(arrowIcon.classList.contains('expanded')).toBeTrue();
  });

  it('should track layers by id using trackByLayerId', () => {
    const layer: MapLayer = { id: 'unique-id', name: 'Test', visible: true };
    const result = component.trackByLayerId(0, layer);
    expect(result).toBe('unique-id');
  });

  it('should display empty state when no layers', () => {
    fixture.componentRef.setInput('layers', []);
    fixture.componentRef.setInput('groups', []);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector(NO_LAYERS_SELECTOR);
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toBe('Нема доступних слојева');
  });

  it('should not display empty state when layers exist', () => {
    fixture.componentRef.setInput('layers', mockLayers);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector(NO_LAYERS_SELECTOR);
    expect(emptyState).toBeFalsy();
  });

  it('should not display empty state when groups exist', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector(NO_LAYERS_SELECTOR);
    expect(emptyState).toBeFalsy();
  });

  it('should show layer name in tooltip', () => {
    fixture.componentRef.setInput('layers', mockLayers);
    fixture.detectChanges();

    const layerNames = fixture.nativeElement.querySelectorAll(
      '.layers-list > .layer-item .layer-name'
    );
    expect(layerNames[0].getAttribute('ng-reflect-message')).toBe('Layer 1');
  });

  it('should display eye open icon for visible layers', () => {
    fixture.componentRef.setInput('layers', [mockLayers[0]]); // visible: true
    fixture.detectChanges();

    const eyeIcon = fixture.nativeElement.querySelector('.layer-item .visibility-toggle .eye-icon');
    expect(eyeIcon).toBeTruthy();
    // Check that it's the open eye (has fill attribute)
    expect(eyeIcon.getAttribute('fill')).toBe('currentColor');
  });

  it('should display eye closed icon for hidden layers', () => {
    fixture.componentRef.setInput('layers', [mockLayers[1]]); // visible: false
    fixture.detectChanges();

    const eyeIcon = fixture.nativeElement.querySelector('.layer-item .visibility-toggle .eye-icon');
    expect(eyeIcon).toBeTruthy();
    // Check that it's the closed eye (has stroke attribute, no fill on path)
    const path = eyeIcon.querySelector('path');
    expect(path.getAttribute('fill')).toBe('none');
  });

  it('should have correct accessibility attributes on visibility toggle', () => {
    fixture.componentRef.setInput('layers', mockLayers);
    fixture.detectChanges();

    const visibilityToggles = fixture.nativeElement.querySelectorAll(VISIBILITY_TOGGLE_SELECTOR);

    // First layer is visible
    expect(visibilityToggles[0].getAttribute(ARIA_LABEL_ATTR)).toBe('Сакриј слој Layer 1');

    // Second layer is not visible
    expect(visibilityToggles[1].getAttribute(ARIA_LABEL_ATTR)).toBe('Прикажи слој Layer 2');
  });

  it('should emit layerToggle for group layers when clicked', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    // Expand group1 to see its layers
    component.toggleGroupExpanded('group1');
    fixture.detectChanges();

    let emittedLayer: MapLayer | null = null;
    component.layerToggle.subscribe(layer => {
      emittedLayer = layer;
    });

    const groupLayerItems = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEM_SELECTOR);
    groupLayerItems[0].click();

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('g1-layer1');
    expect(emittedLayer!.visible).toBeFalse();
  });

  it('should have correct accessibility attributes on close button', () => {
    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON_SELECTOR);
    expect(closeButton.getAttribute(ARIA_LABEL_ATTR)).toBe('Затвори');
  });

  it('should render header with title and close button', () => {
    const header = fixture.nativeElement.querySelector('.header');
    expect(header).toBeTruthy();

    const title = header.querySelector('.title');
    const closeButton = header.querySelector(CLOSE_BUTTON_SELECTOR);

    expect(title).toBeTruthy();
    expect(closeButton).toBeTruthy();
  });

  it('should handle multiple groups with independent expansion state', () => {
    fixture.componentRef.setInput('groups', mockGroups);
    fixture.detectChanges();

    component.toggleGroupExpanded('group1');
    component.toggleGroupExpanded('group2');

    expect(component.isGroupExpanded('group1')).toBeTrue();
    expect(component.isGroupExpanded('group2')).toBeTrue();

    component.toggleGroupExpanded('group1');

    expect(component.isGroupExpanded('group1')).toBeFalse();
    expect(component.isGroupExpanded('group2')).toBeTrue();
  });
});
