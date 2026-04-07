import { Component, inject, input, output, signal } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { EcoLanguage, HeaderComponent } from '../header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { AsyncPipe } from '@angular/common';
import { EcoIcon, IconComponent } from '../icon/icon.component';
import { AUTH_USER_TOKEN } from '../user/user.token';
import { ECO_INITIAL_LANG } from '../header/language.token';
import { ToggleComponent } from '../toggle/toggle.component';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

interface MobileProfileItem {
  id: number;
  title: Observable<string>;
  link?: string;
  icon: EcoIcon;
  action?: () => void;
}

@Component({
  selector: 'eco-layout',
  standalone: true,
  imports: [
    MatDividerModule,
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    SidebarComponent,
    IconComponent,
    AsyncPipe,
    ToggleComponent,
    FormsModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  authUser = inject(AUTH_USER_TOKEN, { optional: true });

  brandingTitle = input<string>('');
  title = input<string>('');
  subtitle = input<string>('');
  hideNotifications = input<boolean>(false);
  showAdminPortal = input<boolean>(true);

  logoutClicked = output<void>();
  languageClicked = output<EcoLanguage>();

  isCyrillic = signal(inject(ECO_INITIAL_LANG) === 'sr-Cyrl');

  mobileProfileLinks: MobileProfileItem[] = [
    {
      id: 1,
      title: this.i18n.header.myProfile,
      link: '/my-profile',
      icon: 'person',
    },
    {
      id: 2,
      title: this.i18n.header.logOut,
      action: () => this.logoutClicked.emit(),
      icon: 'logout',
    },
  ];

  onMobileLanguageToggle(isCyrillic: boolean): void {
    this.isCyrillic.set(isCyrillic);
    const lang: EcoLanguage = isCyrillic ? 'sr-Cyrl' : 'sr-Latn';
    this.languageClicked.emit(lang);
  }

  async handleMobileProfileClick(profile: MobileProfileItem, event: Event): Promise<void> {
    if (profile.action) {
      event.preventDefault();
      profile.action();
    }
  }
}
