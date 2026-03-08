import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CardListComponent } from './card-list.component';
import { CardListConfig } from './card-list.model';

interface TestItem {
  id: number;
  name: string;
}

const mockConfig: CardListConfig<TestItem> = {
  getTitle: item => of(item.name),
};

describe('CardListComponent', () => {
  let component: CardListComponent<TestItem>;
  let fixture: ComponentFixture<CardListComponent<TestItem>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardListComponent<TestItem>);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('config', mockConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty processedCards when no data', () => {
    expect(component.processedCards()).toEqual([]);
  });

  it('should process cards from data input', () => {
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    const cards = component.processedCards();
    expect(cards.length).toBe(1);
    expect(cards[0].title).toBeTruthy();
    expect(cards[0]._original).toEqual({ id: 1, name: 'Test' });
    expect(cards[0]._isSelected).toBeFalse();
  });

  it('should set default severity to none when getSeverity not provided', () => {
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    expect(component.processedCards()[0].severity).toBe('none');
  });

  it('should use getSeverity from config when provided', () => {
    fixture.componentRef.setInput('config', {
      ...mockConfig,
      getSeverity: () => 'blocked' as const,
    });
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    expect(component.processedCards()[0].severity).toBe('blocked');
  });

  it('should select row and emit on rowClick when selectable', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, selectable: true });
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    const emitSpy = spyOn(component.selectRowAction, 'emit');
    component.rowClick(component.processedCards()[0]);

    expect(component.selectedRow()).toEqual({ _original: { id: 1, name: 'Test' } });
    expect(emitSpy).toHaveBeenCalledWith({ _original: { id: 1, name: 'Test' } });
  });

  it('should NOT select row when selectable is false', () => {
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    component.rowClick(component.processedCards()[0]);

    expect(component.selectedRow()).toBeNull();
  });

  it('should mark card as selected based on selectedRowId', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, selectable: true });
    fixture.componentRef.setInput('data', [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' },
    ]);
    fixture.detectChanges();

    component.rowClick(component.processedCards()[0]);
    fixture.detectChanges();

    expect(component.processedCards()[0]._isSelected).toBeTrue();
    expect(component.processedCards()[1]._isSelected).toBeFalse();
  });

  it('should reflect isLoading from config', () => {
    fixture.componentRef.setInput('config', { ...mockConfig, loading: true });
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
  });

  it('should call action onClick and stop propagation', () => {
    const onClickSpy = jasmine.createSpy('onClick');
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;

    fixture.componentRef.setInput('config', {
      ...mockConfig,
      actions: [{ icon: 'delete', onClick: onClickSpy }],
    });
    fixture.componentRef.setInput('data', [{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    const card = component.processedCards()[0];
    component.onActionClick(card, card.actions[0], mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(onClickSpy).toHaveBeenCalledWith({ id: 1, name: 'Test' });
  });
});
