import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NavItem } from '../sidebar/nav-item/nav-item.model';
import { SIDEBAR_ITEMS } from '../sidebar/sidebar.token';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';

describe('LayoutComponent', () => {
  const navItems: NavItem[] = [
    { displayName: 'Link 1' }
  ];

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: SIDEBAR_ITEMS, useValue: navItems },
        provideNoopAnimations(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
