import { InjectionToken } from '@angular/core';

export interface EcoThemeI18n {
  paginator: {
    itemsLabel: string;
    ofLabel: string;
    displayedLabel: string;
    noData: string;
    lastUpdateTitle: string;
    firstPage: string;
    previousPage: string;
    nextPage: string;
    lastPage: string;
    page: string;
    goTo: string;
    side: string;
  };
  table: {
    noData: string;
    loading: string;
  };
  tableFilter: {
    clearFilter: string;
  };
}

export const ECO_THEME_I18N = new InjectionToken<EcoThemeI18n>('ECO_THEME_I18N');

export const DEFAULT_ECO_THEME_I18N: EcoThemeI18n = {
  paginator: {
    itemsLabel: 'ставки',
    ofLabel: 'од',
    displayedLabel: 'Приказано',
    noData: 'Нема података',
    lastUpdateTitle: 'Последње ажурирање',
    firstPage: 'Прва страна',
    previousPage: 'Претходна страна',
    nextPage: 'Следећа страна',
    lastPage: 'Последња страна',
    page: 'Страна: ',
    goTo: 'Иди на',
    side: 'страну',
  },
  table: {
    noData: 'Нема података за приказ',
    loading: 'Учитавање...',
  },
  tableFilter: {
    clearFilter: 'Поништи филтер',
  },
};
