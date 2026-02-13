import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeComponent } from './tree.component';

interface TestTreeItem {
  id: number;
  name: string;
  children: TestTreeItem[];
}

describe('TreeComponent', () => {
  let component: TreeComponent<TestTreeItem>;
  let fixture: ComponentFixture<TreeComponent<TestTreeItem>>;
  const mockData: TestTreeItem[] = [
    {
      id: 1,
      name: 'item',
      children: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeComponent<TestTreeItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
