import { InjectionToken, signal, Signal } from '@angular/core';

export interface EcoThemeI18n {
  paginator: {
    itemsLabel: Signal<string>;
    ofLabel: Signal<string>;
    displayedLabel: Signal<string>;
    noData: Signal<string>;
    lastUpdateTitle: Signal<string>;
    firstPage: Signal<string>;
    previousPage: Signal<string>;
    nextPage: Signal<string>;
    lastPage: Signal<string>;
    page: Signal<string>;
    goTo: Signal<string>;
    side: Signal<string>;
  };
  table: {
    noData: Signal<string>;
    loading: Signal<string>;
  };
  tableFilter: {
    clearFilter: Signal<string>;
    clear: Signal<string>;
    yes: Signal<string>;
    no: Signal<string>;
  };
  tableSerach: {
    search: Signal<string>;
  };
  sideBar: {
    adminPanel: Signal<string>;
  };
  modal: {
    save: Signal<string>;
  };
  header: {
    profile: Signal<string>;
    myProfile: Signal<string>;
    logOut: Signal<string>;
  };
  datePicker: {
    selectDate: Signal<string>;
    selectPeriod: Signal<string>;
    fromDate: Signal<string>;
    toDate: Signal<string>;
    switchToMultiYearViewLabel: Signal<string>;
    nextMonthLabel: Signal<string>;
    nextYearLabel: Signal<string>;
    nextMultiYearLabel: Signal<string>;
    prevMonthLabel: Signal<string>;
    prevYearLabel: Signal<string>;
    prevMultiYearLabel: Signal<string>;
    calendarLabel: Signal<string>;
    openCalendarLabel: Signal<string>;
    closeCalendarLabel: Signal<string>;
    clearDateLabel: Signal<string>;
  };
  map: {
    search: Signal<string>;
    layers: {
      title: Signal<string>;
      street: Signal<string>;
      satellite: Signal<string>;
      terrain: Signal<string>;
    };
  };
  fileUpload: {
    maxFileSize: Signal<string>;
    click: Signal<string>;
    forAddOrDrag: Signal<string>;
  };
}

export const ECO_THEME_I18N = new InjectionToken<EcoThemeI18n>('ECO_THEME_I18N');

export const DEFAULT_ECO_THEME_I18N: EcoThemeI18n = {
  paginator: {
    itemsLabel: signal('ставки'),
    ofLabel: signal('од'),
    displayedLabel: signal('Приказано'),
    noData: signal('Нема података'),
    lastUpdateTitle: signal('Последње ажурирање'),
    firstPage: signal('Прва страна'),
    previousPage: signal('Претходна страна'),
    nextPage: signal('Следећа страна'),
    lastPage: signal('Последња страна'),
    page: signal('Страна: signal('),
    goTo: signal('Иди на'),
    side: signal('страну'),
  },
  table: {
    noData: signal('Нема података за приказ'),
    loading: signal('Учитавање...'),
  },
  tableFilter: {
    clearFilter: signal('Поништи филтер'),
    clear: signal('Поништи'),
    yes: signal('Да'),
    no: signal('Не'),
  },
  tableSerach: {
    search: signal('Претрага'),
  },
  sideBar: {
    adminPanel: signal('Админ панел'),
  },
  modal: {
    save: signal('Сачувај'),
  },
  header: {
    profile: signal('Профил'),
    myProfile: signal('Мој профил'),
    logOut: signal('Одјави се'),
  },
  datePicker: {
    selectDate: signal('Изаберите датум'),
    selectPeriod: signal('Изаберите период'),
    fromDate: signal('Од датума'),
    toDate: signal('До датума'),
    switchToMultiYearViewLabel: signal('Изабери годину'),
    nextMonthLabel: signal('Следећи месец'),
    nextYearLabel: signal('Следећа година'),
    nextMultiYearLabel: signal('Следећих 24 године'),
    prevMonthLabel: signal('Претходни месец'),
    prevYearLabel: signal('Претходна година'),
    prevMultiYearLabel: signal('Претходних 24 године'),
    calendarLabel: signal('Календар'),
    openCalendarLabel: signal('Отвори календар'),
    closeCalendarLabel: signal('Затвори календар'),
    clearDateLabel: signal('Обриши датум'),
  },
  map: {
    search: signal('Претрага'),
    layers: {
      title: signal('Слојеви'),
      street: signal('Карта'),
      satellite: signal('Сателит'),
      terrain: signal('Терен'),
    },
  },
  fileUpload: {
    maxFileSize: signal('Максимална величина фајла'),
    click: signal('Кликни'),
    forAddOrDrag: signal('за додавање или превуци'),
  },
};
