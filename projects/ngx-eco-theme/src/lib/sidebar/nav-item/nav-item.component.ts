import {
  Component,
  HostBinding,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavService } from './nav.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from './nav-item.model';
import { TranslateModule } from '@ngx-translate/core';
import { expanded } from '../../../animations/expanded.animation';
import { indicatorRotate } from '../../../animations/indicator-rotate.animation';


@Component({
  selector: 'eco-nav-item',
  standalone: true,
  imports:[CommonModule, MatIconModule, TranslateModule, RouterModule],
  animations: [indicatorRotate, expanded],
  styleUrl: './nav-item.component.scss',
  templateUrl: './nav-item.component.html',
})
export class NavItemComponent {

  item = input<NavItem>();
  depth = input<number>(0);
  selectedIcon = input<string>();

  notify = output<boolean>();
  toggleMobileLink = output<void>();

  expanded = signal(false);
  disabled = signal(false);
  twoLines = signal(false);

  router = inject(Router);
  private navService = inject(NavService);

  @HostBinding('attr.aria-expanded')
  ariaExpanded = computed(() => this.expanded());

  constructor() {
    effect(
      () => {
        const item = this.item();
        const url = this.navService.currentUrl();

        if (!item?.route || !url) return;

        const isOpen = url.startsWith(item.route);
        this.expanded.set(isOpen);
      },
      { allowSignalWrites: true }
    );
  }


  onItemSelected(item: NavItem) {
    if (!item.children?.length) {
      this.router.navigate([item.route]);
    } else {
      this.expanded.update(v => !v);
    }

    window.scroll({ top: 0, behavior: 'smooth' });

    if (!this.expanded() && window.innerWidth < 1024) {
      this.notify.emit(true);
    }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children?.length && this.expanded() && window.innerWidth < 1024) {
      this.notify.emit(true);
    }
  }

  isDirectlyActive = computed(() => {
    const route = this.item()?.route;
    return !!route && this.router.isActive(route, true);
  });

  isChildActive = computed(() => {
    const children = this.item()?.children;
    if (!children) return false;

    const check = (list: NavItem[]): boolean => {
      return list.some(child =>
        (child.route && this.router.isActive(child.route, true)) ||
        (child.children && check(child.children))
      );
    };

    return check(children);
  });
}
