import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table.component';
import { TableConfig } from './table.model';
import { of } from 'rxjs';


interface TestModel {
  id: number;
  name: string;
}

describe('TableComponent', () => {
  let component: TableComponent<TestModel>;
  let componentRef: ComponentRef<TableComponent<TestModel>>;
  let fixture: ComponentFixture<TableComponent<TestModel>>;
  let config: TableConfig<TestModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<TestModel>);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    config = {
      loading: false,
      emptyMessage: of('no data'),
      columns: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'name',
          label: 'Name',
        },
      ],
    };

    componentRef.setInput('config', config);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
