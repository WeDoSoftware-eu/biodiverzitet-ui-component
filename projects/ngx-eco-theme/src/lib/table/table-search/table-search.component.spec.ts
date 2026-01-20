import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TableSearchComponent } from './table-search.component';
import { provideRouter } from '@angular/router';

describe('TableSearchComponent', () => {
  let component: TableSearchComponent;
  let fixture: ComponentFixture<TableSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSearchComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableSearchComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('storeKey', 'test-key');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
