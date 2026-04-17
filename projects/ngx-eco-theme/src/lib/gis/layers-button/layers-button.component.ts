import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ECO_THEME_I18N, DEFAULT_ECO_THEME_I18N } from '../../eco-theme-I18n';

@Component({
  selector: 'eco-layers-button',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './layers-button.component.html',
  styleUrl: './layers-button.component.scss',
})
export class LayersButtonComponent {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
