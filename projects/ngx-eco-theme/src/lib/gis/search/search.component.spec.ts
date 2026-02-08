import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  const SEARCH_INPUT = '.search-input';
  const SEARCH_BUTTON = '.search-button';

  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    })
      .overrideComponent(SearchComponent, {
        set: { styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default placeholder "Претрага"', () => {
    expect(component.placeholder()).toBe('Претрага');
  });

  it('should have empty searchValue by default', () => {
    expect(component.searchValue()).toBe('');
  });

  it('should render the search input element', () => {
    const input = fixture.nativeElement.querySelector(SEARCH_INPUT);
    expect(input).toBeTruthy();
    expect(input.getAttribute('type')).toBe('text');
  });

  it('should render the search button with SVG icon', () => {
    const button = fixture.nativeElement.querySelector(SEARCH_BUTTON);
    expect(button).toBeTruthy();

    const svg = button.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should display default placeholder in the input', () => {
    const input = fixture.nativeElement.querySelector(SEARCH_INPUT);
    expect(input.getAttribute('placeholder')).toBe('Претрага');
  });

  it('should update placeholder when input signal is set', () => {
    fixture.componentRef.setInput('placeholder', 'Search here');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(SEARCH_INPUT);
    expect(input.getAttribute('placeholder')).toBe('Search here');
  });

  it('should initialize searchValue from value input on ngOnInit', () => {
    const newFixture = TestBed.createComponent(SearchComponent);
    newFixture.componentRef.setInput('value', 'initial text');
    newFixture.detectChanges();

    expect(newFixture.componentInstance.searchValue()).toBe('initial text');
  });

  it('should update searchValue signal on input event', () => {
    const input = fixture.nativeElement.querySelector(SEARCH_INPUT) as HTMLInputElement;
    input.value = 'test query';
    input.dispatchEvent(new Event('input'));

    expect(component.searchValue()).toBe('test query');
  });

  it('should emit valueChange on input event', () => {
    let emittedValue: string | undefined;
    component.valueChange.subscribe((value: string) => {
      emittedValue = value;
    });

    const input = fixture.nativeElement.querySelector(SEARCH_INPUT) as HTMLInputElement;
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));

    expect(emittedValue).toBe('new value');
  });

  it('should emit searchSubmit with current searchValue when onSearch is called', () => {
    let emittedValue: string | undefined;
    component.searchSubmit.subscribe((value: string) => {
      emittedValue = value;
    });

    component.searchValue.set('search term');
    component.onSearch();

    expect(emittedValue).toBe('search term');
  });

  it('should emit searchSubmit when search button is clicked', () => {
    let emittedValue: string | undefined;
    component.searchSubmit.subscribe((value: string) => {
      emittedValue = value;
    });

    component.searchValue.set('clicked search');

    const button = fixture.nativeElement.querySelector(SEARCH_BUTTON);
    button.click();

    expect(emittedValue).toBe('clicked search');
  });

  it('should emit searchSubmit when Enter key is pressed', () => {
    let emittedValue: string | undefined;
    component.searchSubmit.subscribe((value: string) => {
      emittedValue = value;
    });

    component.searchValue.set('enter search');

    const input = fixture.nativeElement.querySelector(SEARCH_INPUT);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(emittedValue).toBe('enter search');
  });

  it('should not emit searchSubmit on non-Enter key press', () => {
    let emitted = false;
    component.searchSubmit.subscribe(() => {
      emitted = true;
    });

    const input = fixture.nativeElement.querySelector(SEARCH_INPUT);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(emitted).toBeFalse();
  });

  it('should have aria-label "Pretraga" on input', () => {
    const input = fixture.nativeElement.querySelector(SEARCH_INPUT);
    expect(input.getAttribute('aria-label')).toBe('Pretraga');
  });

  it('should have aria-label "Pretrazi" on search button', () => {
    const button = fixture.nativeElement.querySelector(SEARCH_BUTTON);
    expect(button.getAttribute('aria-label')).toBe('Pretrazi');
  });

  it('should have type="button" on search button', () => {
    const button = fixture.nativeElement.querySelector(SEARCH_BUTTON);
    expect(button.getAttribute('type')).toBe('button');
  });
});
