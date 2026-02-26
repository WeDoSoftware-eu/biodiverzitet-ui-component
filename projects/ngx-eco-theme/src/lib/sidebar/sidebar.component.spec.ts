import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NavItem } from './nav-item/nav-item.model';
import { SidebarComponent } from './sidebar.component';
import { SIDEBAR_ITEMS } from './sidebar.token';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  const navItems: NavItem[] = [{ displayName: of('Link 1') }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: SIDEBAR_ITEMS, useValue: navItems },
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
