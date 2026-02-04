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
    yes: string;
    no: string;
  };
  tableSerach: {
    search: string;
  };
  sideBar: {
    adminPanel: string;
  };
  modal: {
    save: string;
  };
  header: {
    profile: string;
    myProfile: string;
    logOut: string;
  };
  datePicker: {
    selectDate: string;
    selectPeriod: string;
    fromDate: string;
    toDate: string;
    switchToMultiYearViewLabel: string;
    nextMonthLabel: string;
    nextYearLabel: string;
    nextMultiYearLabel: string;
    prevMonthLabel: string;
    prevYearLabel: string;
    prevMultiYearLabel: string;
    calendarLabel: string;
    openCalendarLabel: string;
    closeCalendarLabel: string;
    clearDateLabel: string;
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
    yes: 'Да',
    no: 'Не',
  },
  tableSerach: {
    search: 'Претрага',
  },
  sideBar: {
    adminPanel: 'Админ панел',
  },
  modal: {
    save: 'Сачувај',
  },
  header: {
    profile: 'Профил',
    myProfile: 'Мој профил',
    logOut: 'Одјави се',
  },
  datePicker: {
    selectDate: 'Изаберите датум',
    selectPeriod: 'Изаберите период',
    fromDate: 'Од датума',
    toDate: 'До датума',
    switchToMultiYearViewLabel: 'Изабери годину',
    nextMonthLabel: 'Следећи месец',
    nextYearLabel: 'Следећа година',
    nextMultiYearLabel: 'Следећих 24 године',
    prevMonthLabel: 'Претходни месец',
    prevYearLabel: 'Претходна година',
    prevMultiYearLabel: 'Претходних 24 године',
    calendarLabel: 'Календар',
    openCalendarLabel: 'Отвори календар',
    closeCalendarLabel: 'Затвори календар',
    clearDateLabel: 'Обриши датум',
  },
};
