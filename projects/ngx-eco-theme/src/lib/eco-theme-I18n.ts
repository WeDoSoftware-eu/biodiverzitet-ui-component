import { InjectionToken } from '@angular/core';

export interface EcoThemeI18n {
  paginator: {
    itemsLabel: string;
    ofLabel: string;
    displayedLabel: string;
    noData: string;
    lastUpdateTitle:string;
  };
  table: {
    noData: string;
    loading: string;
  };
}

export const ECO_THEME_I18N = new InjectionToken<EcoThemeI18n>('ECO_THEME_I18N');

export const DEFAULT_ECO_THEME_I18N: EcoThemeI18n = {
  paginator: {
    itemsLabel: 'ставки',
    ofLabel: 'од',
    displayedLabel: 'Приказано',
    noData: 'Нема података',
    lastUpdateTitle: 'Последње ажурирање'
  },
  table: {
    noData: 'Нема података за приказ',
    loading: 'Учитавање...'
  }
};
