import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtmLayersSelectorComponent } from './utm-layers-selector.component';
import { MapLayer, MapLayerGroup } from '../layers-selector/layer.model';

describe('UtmLayersSelectorComponent', () => {
  const NO_LAYERS = '.no-layers';
  const ARIA_LABEL = 'aria-label';
  const LAYER_ITEM = '.layer-item';
  const GROUP_HEADER = '.group-header';
  const GROUP_LAYERS = '.group-layers';
  const CLOSE_BUTTON = '.close-button';
  const SHOW_ALL_ITEM = '.show-all-item';
  const GROUP_SEARCH_BAR = '.group-search-bar';
  const GROUP_LAYER_ITEMS = '.group-layers .layer-item';

  let component: UtmLayersSelectorComponent;
  let fixture: ComponentFixture<UtmLayersSelectorComponent>;

  const mockGroup: MapLayerGroup = {
    id: 'group-1',
    name: 'Природна добра',
    layers: [
      { id: 'g1-layer-1', name: 'Национални паркови', visible: true },
      { id: 'g1-layer-2', name: 'Резервати природе', visible: false },
    ],
    expanded: false,
  };

  const mockGroupAllVisible: MapLayerGroup = {
    id: 'group-2',
    name: 'Друга група',
    layers: [
      { id: 'g2-layer-1', name: 'Слој А', visible: true },
      { id: 'g2-layer-2', name: 'Слој Б', visible: true },
    ],
    expanded: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtmLayersSelectorComponent],
    })
      .overrideComponent(UtmLayersSelectorComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UtmLayersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Creation & Defaults ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Филтери');
  });

  it('should display custom title when provided', () => {
    fixture.componentRef.setInput('title', 'Моји филтери');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Моји филтери');
  });

  // --- Empty State ---

  it('should show empty state when no groups', () => {
    const noLayers = fixture.nativeElement.querySelector(NO_LAYERS);
    expect(noLayers).toBeTruthy();
    expect(noLayers.textContent).toContain('Нема доступних филтера');
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

    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON);
    closeButton.click();

    expect(emitted).toBeTrue();
  });

  it('should have close button with aria-label', () => {
    const closeButton = fixture.nativeElement.querySelector(CLOSE_BUTTON);
    expect(closeButton.getAttribute(ARIA_LABEL)).toBe('Затвори');
  });

  // --- Group Headers ---

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

  // --- Group Expand/Collapse ---

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

  it('should toggle group expanded state via toggleGroupExpanded', () => {
    expect(component.isGroupExpanded('group-1')).toBeFalse();

    component.toggleGroupExpanded('group-1');
    expect(component.isGroupExpanded('group-1')).toBeTrue();

    component.toggleGroupExpanded('group-1');
    expect(component.isGroupExpanded('group-1')).toBeFalse();
  });

  // --- Show All Toggle ---

  it('should show "show all" item when group is expanded', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const showAll = fixture.nativeElement.querySelector(SHOW_ALL_ITEM);
    expect(showAll).toBeTruthy();

    const label = showAll.querySelector('.show-all-label');
    expect(label.textContent).toContain('Прикажи све');
  });

  it('should emit groupToggleAll when show all is clicked', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    let emittedEvent: { groupId: string; selectAll: boolean } | undefined;
    component.groupToggleAll.subscribe(event => {
      emittedEvent = event;
    });

    const showAll = fixture.nativeElement.querySelector(SHOW_ALL_ITEM);
    showAll.click();

    expect(emittedEvent).toBeTruthy();
    expect(emittedEvent!.groupId).toBe('group-1');
    expect(emittedEvent!.selectAll).toBeTrue();
  });

  it('should emit groupToggleAll with selectAll false when all layers are visible', () => {
    fixture.componentRef.setInput('groups', [mockGroupAllVisible]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    let emittedEvent: { groupId: string; selectAll: boolean } | undefined;
    component.groupToggleAll.subscribe(event => {
      emittedEvent = event;
    });

    const showAll = fixture.nativeElement.querySelector(SHOW_ALL_ITEM);
    showAll.click();

    expect(emittedEvent).toBeTruthy();
    expect(emittedEvent!.selectAll).toBeFalse();
  });

  // --- Per-Group Search ---

  it('should show group search bar when group is expanded', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const searchBar = fixture.nativeElement.querySelector(GROUP_SEARCH_BAR);
    expect(searchBar).toBeTruthy();

    const searchInput = searchBar.querySelector('.search-input');
    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('placeholder')).toBe('Претрага...');
  });

  it('should not show group search bar when group is collapsed', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const searchBar = fixture.nativeElement.querySelector(GROUP_SEARCH_BAR);
    expect(searchBar).toBeNull();
  });

  it('should filter layers within group when searching', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    component.groupSearchTexts.update(current => ({
      ...current,
      'group-1': 'национални',
    }));
    fixture.detectChanges();

    const filtered = component.filteredGroups();
    expect(filtered.length).toBe(1);
    expect(filtered[0].layers.length).toBe(1);
    expect(filtered[0].layers[0].name).toBe('Национални паркови');
  });

  it('should clear group search text when clearGroupSearch is called', () => {
    component.groupSearchTexts.update(current => ({
      ...current,
      'group-1': 'тест',
    }));
    expect(component.getGroupSearchText('group-1')).toBe('тест');

    component.clearGroupSearch('group-1');
    expect(component.getGroupSearchText('group-1')).toBe('');
  });

  it('should auto-expand group when search text is present', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    expect(component.isGroupExpanded('group-1')).toBeFalse();

    component.groupSearchTexts.update(current => ({
      ...current,
      'group-1': 'национални',
    }));
    fixture.detectChanges();

    expect(component.isGroupExpanded('group-1')).toBeTrue();
  });

  // --- Layer Toggle ---

  it('should show layers inside expanded group', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const groupLayerItems = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEMS);
    expect(groupLayerItems.length).toBe(2);
  });

  it('should emit layerToggle with toggled visibility when onLayerToggle is called', () => {
    let emittedLayer: MapLayer | undefined;
    component.layerToggle.subscribe((layer: MapLayer) => {
      emittedLayer = layer;
    });

    component.onLayerToggle(mockGroup.layers[0]);

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.id).toBe('g1-layer-1');
    expect(emittedLayer!.visible).toBeFalse();
  });

  it('should emit layerToggle with visible true for hidden layer', () => {
    let emittedLayer: MapLayer | undefined;
    component.layerToggle.subscribe((layer: MapLayer) => {
      emittedLayer = layer;
    });

    component.onLayerToggle(mockGroup.layers[1]);

    expect(emittedLayer).toBeTruthy();
    expect(emittedLayer!.visible).toBeTrue();
  });

  it('should show eye-open icon for visible layers', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const layerItems = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEMS);
    const eyeIcon = layerItems[0].querySelector('.visibility-toggle svg');
    expect(eyeIcon).toBeTruthy();
    expect(eyeIcon.getAttribute('viewBox')).toBe('0 0 22 15');
  });

  it('should show eye-closed icon for hidden layers', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const layerItems = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEMS);
    const eyeIcon = layerItems[1].querySelector('.visibility-toggle svg');
    expect(eyeIcon).toBeTruthy();
    expect(eyeIcon.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  // --- Internal State ---

  it('should check isAllSelected correctly', () => {
    expect(component.isAllSelected(mockGroup)).toBeFalse();
    expect(component.isAllSelected(mockGroupAllVisible)).toBeTrue();
  });

  // --- Accessibility ---

  it('should have role="button" and tabindex on group headers', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    expect(groupHeader.getAttribute('role')).toBe('button');
    expect(groupHeader.getAttribute('tabindex')).toBe('0');
  });

  it('should have role="button" and tabindex on layer items', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const layerItem = fixture.nativeElement.querySelector(LAYER_ITEM);
    expect(layerItem.getAttribute('role')).toBe('button');
    expect(layerItem.getAttribute('tabindex')).toBe('0');
  });

  it('should have visibility toggle aria-label for visible layer', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const layerItems = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEMS);
    const toggle = layerItems[0].querySelector('.visibility-toggle');
    expect(toggle.getAttribute(ARIA_LABEL)).toBe('Сакриј слој Национални паркови');
  });

  it('should have visibility toggle aria-label for hidden layer', () => {
    fixture.componentRef.setInput('groups', [mockGroup]);
    fixture.detectChanges();

    const groupHeader = fixture.nativeElement.querySelector(GROUP_HEADER);
    groupHeader.click();
    fixture.detectChanges();

    const layerItems = fixture.nativeElement.querySelectorAll(GROUP_LAYER_ITEMS);
    const toggle = layerItems[1].querySelector('.visibility-toggle');
    expect(toggle.getAttribute(ARIA_LABEL)).toBe('Прикажи слој Резервати природе');
  });
});
