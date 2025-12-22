import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItemComponent } from './nav-item/nav-item.component';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SIDEBAR_ITEMS } from './sidebar.token';
import { RoutingService } from './routing.service';

@Component({
  selector: 'eco-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NavItemComponent,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  brandingTitle = input<string>('');

  navItems = inject(SIDEBAR_ITEMS);
  expandedSections = signal<Set<string>>(new Set());

  private routing = inject(RoutingService);

  toggleSection(sectionName: string): void {
    this.expandedSections.update(sections => {
      const newSections = new Set(sections);
      if (newSections.has(sectionName)) {
        newSections.delete(sectionName);
      } else {
        newSections.add(sectionName);
      }
      return newSections;
    });
  }

  isSectionExpanded(sectionName: string): boolean {
    return this.expandedSections().has(sectionName);
  }

  navigateTo(route: string): void {
    this.routing.navigateTo(route);
  }

  isActive(route: string): boolean {
    return this.routing.isActive(route);
  }
}
