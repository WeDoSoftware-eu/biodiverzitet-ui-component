import { Component, inject, input, OnInit, DestroyRef, output } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EcoIcon, IconComponent } from '../icon/icon.component';
import { AUTH_USER_TOKEN } from '../user/user.token';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BACK_ROUTES } from './back-route.token';

interface profileItems {
  id: number;
  title: string;
  link?: string;
  icon: EcoIcon;
  action?: () => void | Promise<void>;
}

@Component({
  selector: 'eco-header',
  standalone: true,
  imports: [MatDividerModule, RouterModule, MatMenuModule, MatToolbarModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  authUser = inject(AUTH_USER_TOKEN, { optional: true });

  private router = inject(Router);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  title = input<string>('');
  subtitle = input<string>('');

  logoutClicked = output<void>();

  profileLinks: profileItems[] = [
    {
      id: 1,
      title: this.i18n.header.myProfile,
      link: '/my-profile',
      icon: 'person',
    },
    {
      id: 2,
      title: this.i18n.header.logOut,
      action: () => this.onLogout(),
      icon: 'logout',
    },
  ];

  showBackButton = false;

  private routesWithBackButton = inject(BACK_ROUTES);

  ngOnInit(): void {
    // Check initial route
    this.checkRoute(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.checkRoute((event as NavigationEnd).urlAfterRedirects);
      });
  }
  private checkRoute(url: string): void {
    this.showBackButton = this.routesWithBackButton.some(route => url.includes(route));
  }

  goBack(): void {
    this.location.back();
  }

  //Call auth store to logout user
  async onLogout() {
    this.logoutClicked.emit();
  }

  //Call this function if link is null
  async handleProfileClick(profile: profileItems, event: Event) {
    if (profile.action) {
      event.preventDefault();
      await profile.action();
    }
  }
}
