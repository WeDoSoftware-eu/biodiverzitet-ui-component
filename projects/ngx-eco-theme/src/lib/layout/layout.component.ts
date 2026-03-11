import { Component, inject, input, output } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ButtonComponent } from '../button/button.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'eco-layout',
  standalone: true,
  imports: [
    MatDividerModule,
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    SidebarComponent,
    ButtonComponent,
    AsyncPipe,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  brandingTitle = input<string>('');
  title = input<string>('');
  subtitle = input<string>('');
  hideNotifications = input<boolean>(false);
  showAdminPortal = input<boolean>(true);

  logoutClicked = output<void>();
}
