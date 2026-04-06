import { InjectionToken } from '@angular/core';
import { EcoLanguage } from './header.component';

export const ECO_INITIAL_LANG = new InjectionToken<EcoLanguage>('ECO_INITIAL_LANG', {
  factory: () => 'sr-Cyrl',
});
