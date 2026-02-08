import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersSelectorComponent } from './layers-selector.component';
import { MapLayer, MapLayerGroup } from './layer.model';

describe('LayersSelectorComponent', () => {
  const NO_LAYERS = '.no-layers';
  const ARIA_LABEL = 'aria-label';
  const LAYER_ITEM = '.layer-item';
  const GROUP_HEADER = '.group-header';
  const GROUP_LAYERS = '.group-layers';

  let component: LayersSelectorComponent;
  let fixture: ComponentFixture<LayersSelectorComponent>;

  const mockLayer: MapLayer = {
    id: 'layer-1',
    name: 'Заштићена подручја',
    visible: true,
    type: 'wms',
  };

  const mockLayerHidden: MapLayer = {
    id: 'layer-2',
    name: 'Станишта',
    visible: false,
    type: 'wfs',
  };

  const mockGroup: MapLayerGroup = {
    id: 'group-1',
    name: 'Природна добра',
    layers: [
      { id: 'g1-layer-1', name: 'Национални паркови', visible: true },
      { id: 'g1-layer-2', name: 'Резервати природе', visible: false },
    ],
    expanded: false,
  };

  const mockGroupEmpty: MapLayerGroup = {
    id: 'group-2',
    name: 'Празна група',
    layers: [],
    expanded: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersSelectorComponent],
    })
      .overrideComponent(LayersSelectorComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LayersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Creation & Defaults ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Слојеви');
  });

  it('should display custom title when provided', () => {
    fixture.componentRef.setInput('title', 'Моји слојеви');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Моји слојеви');
  });

  it('should show empty state when no layers or groups', () => {
    const noLayers = fixture.nativeElement.querySelector(NO_LAYERS);
    expect(noLayers).toBeTruthy();
    expect(noLayers.textContent).toContain('Нема доступних слојева');
  });

  it('should not show empty state when layers are provided', () => {
    fixture.componentRef.setInput('layers', [mockLayer]);
    fixture.detectChanges();

    const noLayers = fixture.nativeElement.querySelector(NO_LAYERS);
    expect(noLayers).toBeNull();
  });

  it('should not show empty state when groups are provided', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const noLayers = fixture.nativeElement.querySelector(NO_LAYERS);
    expect(noLayers).toBeNull();
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

    const closeButton = fixture.nativeElement.querySelector('.close-button');
    closeButton.click();

    expect(emitted).toBeTrue();
  });

  it('should have close button with aria-label', () => {
    const closeButton = fixture.nativeElement.querySelector('.close-button');
    expect(closeButton.getAttribute(ARIA_LABEL)).toBe('Затвори');
  });

  // --- Standalone Layers ---

  it('should render standalone layer items', () => {
    fixture.componentRef.setInput('layers', [mockLayer, mockLayerHidden]);
    fixture.detectChanges();

    const layerItems = fixture.nativeElement.querySelectorAll('.layers-list > .layer-item');
    expect(layerItems.length).toBe(2);
  });

  it('should display layer names', () => {
    fixture.componentRef.setInput('layers', [mockLayer]);
    fixture.detectChanges();

    const layerName = fixture.nativeElement.querySelector('.layer-item .layer-name');
    expect(layerName.textContent).toContain('Заштићена подручја');
  });

  it('should show eye-open icon for visible layers', () => {
    fixture.componentRef.setInput('layers', [mockLayer]);
    fixture.detectChanges();

    const layerItem = fixture.nativeElement.querySelector(LAYER_ITEM);
    const eyeIcon = layerItem.querySelector('.visibility-toggle svg');
    expect(eyeIcon).toBeTruthy();
    expect(eyeIcon.getAttribute('viewBox')).toBe('0 0 22 15');
  });

  it('should show eye-closed icon for hidden layers', () => {
    fixture.componentRef.setInput('layers', [mockLayerHidden]);
    fixture.detectChanges();

    const layerItem = fixture.nativeElement.querySelector(LAYER_ITEM);
    const eyeIcon = layerItem.querySelector('.visibility-toggle svg');
    expect(eyeIcon).toBeTruthy();
    expect(eyeIcon.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should emit layerToggle with toggled visibility when onLayerToggle is called', () => {
    let emittedLayer: MapLayer | undefined;
    component.layerToggle.subscribe((layer: MapLayer) => {
      emittedLayer = layer;
    });

    component.onLayerToggle(mockLayer);

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('layer-1');
    expect(emittedLayer!.visible).toBeFalse();
  });

  it('should emit layerToggle with visible true for hidden layer', () => {
    let emittedLayer: MapLayer | undefined;
    component.layerToggle.subscribe((layer: MapLayer) => {
      emittedLayer = layer;
    });

    component.onLayerToggle(mockLayerHidden);

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.visible).toBeTrue();
  });

  it('should emit layerToggle when standalone layer item is clicked', () => {
    fixture.componentRef.setInput('layers', [mockLayer]);
    fixture.detectChanges();

    let emittedLayer: MapLayer | undefined;
    component.layerToggle.subscribe((layer: MapLayer) => {
      emittedLayer = layer;
    });

    const layerItem = fixture.nativeElement.querySelector('.layers-list > .layer-item');
    layerItem.click();

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('layer-1');
    expect(emittedLayer!.visible).toBeFalse();
  });

  // --- Layer Groups ---

  it('should render group headers', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    expect(groupHeader).toBeTruthy();

    const groupName = groupHeader.querySelector('.group-name');
    expect(groupName.textContent).toContain('Природна добра');
  });

  it('should not show group layers by default', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupLayers = fixture.nativeElement.querySelector(GROUP_LAYERS);
    expect(groupLayers).toBeNull();
  });

  it('should expand group when group header is clicked', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const groupLayers = fixture.nativeElement.querySelector(GROUP_LAYERS);
    expect(groupLayers).toBeTruthy();
  });

  it('should collapse expanded group on second click', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);

    groupHeader.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(GROUP_LAYERS)).toBeTruthy();

    groupHeader.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(GROUP_LAYERS)).toBeNull();
  });

  it('should show layers inside expanded group', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const groupLayerItems = fixture.nativeElement.querySelectorAll('.group-layers .layer-item');
    expect(groupLayerItems.length).toBe(2);

    const firstLayerName = groupLayerItems[0].querySelector('.layer-name');
    expect(firstLayerName.textContent).toContain('Национални паркови');

    const secondLayerName = groupLayerItems[1].querySelector('.layer-name');
    expect(secondLayerName.textContent).toContain('Резервати природе');
  });

  it('should emit layerToggle for grouped layer click', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    let emittedLayer: MapLayer | undefined;
    component.layerToggle.subscribe((layer: MapLayer) => {
      emittedLayer = layer;
    });

    const groupLayerItem = fixture.nativeElement.querySelector('.group-layers .layer-item');
    groupLayerItem.click();

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('g1-layer-1');
    expect(emittedLayer!.visible).toBeFalse();
  });

  it('should add expanded class to arrow icon when group is expanded', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const arrowIcon = fixture.nativeElement.querySelector('.arrow-icon');
    expect(arrowIcon.classList.contains('expanded')).toBeFalse();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    expect(arrowIcon.classList.contains('expanded')).toBeTrue();
  });

  it('should render multiple groups independently', () => {
    fixture.componentRef.setInput('groups', [mockGroup, mockGroupEmpty]);
    fixture.detectChanges();

    const groupHeaders = fixture.nativeElement.querySelectorAll(GROUP_HEADER);
    expect(groupHeaders.length).toBe(2);

    groupHeaders[0].click();
    fixture.detectChanges();

    const expandedGroupLayers = fixture.nativeElement.querySelectorAll(GROUP_LAYERS);
    expect(expandedGroupLayers.length).toBe(1);
  });

  // --- Internal State ---

  it('should toggle group expanded state via toggleGroupExpanded', () => {
    expect(component.isGroupExpanded('group-1')).toBeFalse();

    component.toggleGroupExpanded('group-1');
    expect(component.isGroupExpanded('group-1')).toBeTrue();

    component.toggleGroupExpanded('group-1');
    expect(component.isGroupExpanded('group-1')).toBeFalse();
  });

  it('should track layers by id', () => {
    expect(component.trackByLayerId(0, mockLayer)).toBe('layer-1');
    expect(component.trackByLayerId(1, mockLayerHidden)).toBe('layer-2');
  });

  // --- Accessibility ---

  it('should have role="button" and tabindex on layer items', () => {
    fixture.componentRef.setInput('layers', [mockLayer]);
    fixture.detectChanges();

    const layerItem = fixture.nativeElement.querySelector(LAYER_ITEM);
    expect(layerItem.getAttribute('role')).toBe('button');
    expect(layerItem.getAttribute('tabindex')).toBe('0');
  });

  it('should have role="button" and tabindex on group headers', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    expect(groupHeader.getAttribute('role')).toBe('button');
    expect(groupHeader.getAttribute('tabindex')).toBe('0');
  });

  it('should have visibility toggle aria-label for visible layer', () => {
    fixture.componentRef.setInput('layers', [mockLayer]);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.visibility-toggle');
    expect(toggle.getAttribute(ARIA_LABEL)).toBe('Сакриј слој Заштићена подручја');
  });

  it('should have visibility toggle aria-label for hidden layer', () => {
    fixture.componentRef.setInput('layers', [mockLayerHidden]);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.visibility-toggle');
    expect(toggle.getAttribute(ARIA_LABEL)).toBe('Прикажи слој Станишта');
  });
});
