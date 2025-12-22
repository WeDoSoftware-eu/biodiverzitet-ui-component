import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { FormsModule } from '@angular/forms';

describe('TableComponent', () => {
  let component: TableComponent<unknown>;
  let fixture: ComponentFixture<TableComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<unknown>);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
