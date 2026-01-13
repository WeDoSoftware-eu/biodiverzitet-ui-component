import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';

const INPUT_SELECTOR = '.search-input';
const BUTTON_SELECTOR = '.search-button';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchValue from value input on init', () => {
    const newFixture = TestBed.createComponent(SearchComponent);
    const newComponent = newFixture.componentInstance;

    newFixture.componentRef.setInput('value', 'initial search');
    newFixture.detectChanges();

    expect(newComponent.searchValue()).toBe('initial search');
  });

  it('should emit valueChange on input', () => {
    let emittedValue = null as string | null;
    component.valueChange.subscribe(value => {
      emittedValue = value;
    });

    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    input.value = 'test search';
    input.dispatchEvent(new Event('input'));

    expect(emittedValue).toBe('test search');
  });

  it('should update searchValue signal on input', () => {
    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));

    expect(component.searchValue()).toBe('new value');
  });

  it('should emit searchSubmit when search button is clicked', () => {
    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    input.value = 'search term';
    input.dispatchEvent(new Event('input'));

    let submittedValue = null as string | null;
    component.searchSubmit.subscribe(value => {
      submittedValue = value;
    });

    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    button.click();

    expect(submittedValue).toBe('search term');
  });

  it('should emit searchSubmit when onSearch method is called', () => {
    component.searchValue.set('direct call');

    let submittedValue = null as string | null;
    component.searchSubmit.subscribe(value => {
      submittedValue = value;
    });

    component.onSearch();

    expect(submittedValue).toBe('direct call');
  });

  it('should emit searchSubmit when Enter key is pressed', () => {
    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    input.value = 'enter search';
    input.dispatchEvent(new Event('input'));

    let submittedValue = null as string | null;
    component.searchSubmit.subscribe(value => {
      submittedValue = value;
    });

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(enterEvent);

    expect(submittedValue).toBe('enter search');
  });

  it('should not emit searchSubmit when other keys are pressed', () => {
    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    input.value = 'some text';
    input.dispatchEvent(new Event('input'));

    let submittedValue = null as string | null;
    component.searchSubmit.subscribe(value => {
      submittedValue = value;
    });

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    input.dispatchEvent(escapeEvent);

    expect(submittedValue).toBeNull();
  });

  it('should display placeholder from input', () => {
    fixture.componentRef.setInput('placeholder', 'Custom placeholder');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    expect(input.getAttribute('placeholder')).toBe('Custom placeholder');
  });

  it('should have default placeholder in Serbian', () => {
    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    expect(input.getAttribute('placeholder')).toBe('Претрага');
  });

  it('should have default empty value', () => {
    expect(component.value()).toBe('');
    expect(component.searchValue()).toBe('');
  });

  it('should have correct accessibility attributes on input', () => {
    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    expect(input.getAttribute('aria-label')).toBe('Pretraga');
    expect(input.getAttribute('type')).toBe('text');
  });

  it('should have correct accessibility attributes on button', () => {
    const button = fixture.nativeElement.querySelector(BUTTON_SELECTOR);
    expect(button.getAttribute('aria-label')).toBe('Pretrazi');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('should render SVG icon in search button', () => {
    const svg = fixture.nativeElement.querySelector('.search-button svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('width')).toBe('21');
    expect(svg.getAttribute('height')).toBe('21');
  });

  it('should call onInput when input event is triggered', () => {
    const onInputSpy = spyOn(component, 'onInput').and.callThrough();

    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    input.value = 'spy test';
    input.dispatchEvent(new Event('input'));

    expect(onInputSpy).toHaveBeenCalled();
  });

  it('should call onKeydown when keydown event is triggered', () => {
    const onKeydownSpy = spyOn(component, 'onKeydown').and.callThrough();

    const input = fixture.nativeElement.querySelector(INPUT_SELECTOR);
    const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
    input.dispatchEvent(keyEvent);

    expect(onKeydownSpy).toHaveBeenCalled();
  });
});
