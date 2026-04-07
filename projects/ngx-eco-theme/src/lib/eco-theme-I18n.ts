import { InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface EcoThemeI18n {
  paginator: {
    itemsLabel: Observable<string>;
    ofLabel: Observable<string>;
    displayedLabel: Observable<string>;
    noData: Observable<string>;
    lastUpdateTitle: Observable<string>;
    firstPage: Observable<string>;
    previousPage: Observable<string>;
    nextPage: Observable<string>;
    lastPage: Observable<string>;
    page: Observable<string>;
    goTo: Observable<string>;
    side: Observable<string>;
    generateReport: Observable<string>;
  };
  table: {
    noData: Observable<string>;
    loading: Observable<string>;
  };
  tableFilter: {
    clearFilter: Observable<string>;
    clear: Observable<string>;
    yes: Observable<string>;
    no: Observable<string>;
    search: Observable<string>;
    noResultsFound: Observable<string>;
    filter: Observable<string>;
  };
  tableSerach: {
    search: Observable<string>;
  };
  sideBar: {
    adminPanel: Observable<string>;
  };
  modal: {
    save: Observable<string>;
    close: Observable<string>;
  };
  header: {
    profile: Observable<string>;
    myProfile: Observable<string>;
    logOut: Observable<string>;
  };
  datePicker: {
    selectDate: Observable<string>;
    selectPeriod: Observable<string>;
    fromDate: Observable<string>;
    toDate: Observable<string>;
    switchToMultiYearViewLabel: Observable<string>;
    nextMonthLabel: Observable<string>;
    nextYearLabel: Observable<string>;
    nextMultiYearLabel: Observable<string>;
    prevMonthLabel: Observable<string>;
    prevYearLabel: Observable<string>;
    prevMultiYearLabel: Observable<string>;
    calendarLabel: Observable<string>;
    openCalendarLabel: Observable<string>;
    closeCalendarLabel: Observable<string>;
    clearDateLabel: Observable<string>;
  };
  map: {
    search: Observable<string>;
    layers: {
      title: Observable<string>;
      street: Observable<string>;
      satellite: Observable<string>;
      terrain: Observable<string>;
    };
  };
  fileUpload: {
    maxFileSize: Observable<string>;
    click: Observable<string>;
    forAddOrDrag: Observable<string>;
    removeFile: Observable<string>;
  };
  documentUpload: {
    clickToUpload: Observable<string>;
    orDragFile: Observable<string>;
    maxFileSize: Observable<string>;
    fileTooLarge: Observable<string>;
    removeFile: Observable<string>;
  };
  documentPreview: {
    unsupportedPreview: Observable<string>;
    downloadFile: Observable<string>;
    close: Observable<string>;
  };
}

export const ECO_THEME_I18N = new InjectionToken<EcoThemeI18n>('ECO_THEME_I18N');

export const DEFAULT_ECO_THEME_I18N: EcoThemeI18n = {
  paginator: {
    itemsLabel: of('ставки'),
    ofLabel: of('од'),
    displayedLabel: of('Приказано'),
    noData: of('Нема података'),
    lastUpdateTitle: of('Последње ажурирање'),
    firstPage: of('Прва страна'),
    previousPage: of('Претходна страна'),
    nextPage: of('Следећа страна'),
    lastPage: of('Последња страна'),
    page: of('Страна: of('),
    goTo: of('Иди на'),
    side: of('страну'),
    generateReport: of('Генериши извештај'),
  },
  table: {
    noData: of('Нема података за приказ'),
    loading: of('Учитавање...'),
  },
  tableFilter: {
    clearFilter: of('Поништи филтер'),
    clear: of('Поништи'),
    yes: of('Да'),
    no: of('Не'),
    search: of('Претрага'),
    noResultsFound: of('Нема резултата'),
    filter: of('Филтрирај'),
  },
  tableSerach: {
    search: of('Претрага'),
  },
  sideBar: {
    adminPanel: of('Админ панел'),
  },
  modal: {
    save: of('Сачувај'),
    close: of('Затвори'),
  },
  header: {
    profile: of('Профил'),
    myProfile: of('Мој профил'),
    logOut: of('Одјави се'),
  },
  datePicker: {
    selectDate: of('Изаберите датум'),
    selectPeriod: of('Изаберите период'),
    fromDate: of('Од датума'),
    toDate: of('До датума'),
    switchToMultiYearViewLabel: of('Изабери годину'),
    nextMonthLabel: of('Следећи месец'),
    nextYearLabel: of('Следећа година'),
    nextMultiYearLabel: of('Следећих 24 године'),
    prevMonthLabel: of('Претходни месец'),
    prevYearLabel: of('Претходна година'),
    prevMultiYearLabel: of('Претходних 24 године'),
    calendarLabel: of('Календар'),
    openCalendarLabel: of('Отвори календар'),
    closeCalendarLabel: of('Затвори календар'),
    clearDateLabel: of('Обриши датум'),
  },
  map: {
    search: of('Претрага'),
    layers: {
      title: of('Слојеви'),
      street: of('Карта'),
      satellite: of('Сателит'),
      terrain: of('Терен'),
    },
  },
  fileUpload: {
    maxFileSize: of('Максимална величина фајла'),
    click: of('Кликни'),
    forAddOrDrag: of('за додавање или превуци'),
    removeFile: of('Уклони фајл'),
  },
  documentUpload: {
    clickToUpload: of('Кликни за отпремање'),
    orDragFile: of('или превуци фајл'),
    maxFileSize: of('Максимална величина фајла:'),
    fileTooLarge: of('Фајл је превелик'),
    removeFile: of('Уклони фајл'),
  },
  documentPreview: {
    unsupportedPreview: of('Детаљан приказ није доступан за овај тип фајла.'),
    downloadFile: of('Преузми фајл'),
    close: of('Затвори'),
  },
};
