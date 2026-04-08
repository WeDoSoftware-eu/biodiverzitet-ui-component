import { Component, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'eco-no-access-mobile',
  standalone: true,
  imports: [IconComponent, AsyncPipe],
  templateUrl: './no-access-mobile.component.html',
  styleUrl: './no-access-mobile.component.scss',
})
export class NoAccessMobileComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;
}
