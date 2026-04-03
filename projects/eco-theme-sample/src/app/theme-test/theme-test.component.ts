import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BACK_ROUTES, ChipComponent, ChipStatus, ECO_ICONS, EcoIcon, FilterEvent, FilterFieldConfig, HeaderComponent, IconComponent, TableComponent, TableConfig, TableFilterComponent, TablePaginatorComponent } from 'ngx-eco-theme';
import { debounceTime, of, Subject, takeUntil } from 'rxjs';
import {
  CardListComponent,
  CardListConfig,
  CardSeverity,
  FileUploadComponent,
  ModalComponent,
} from '../../../../ngx-eco-theme/src/public-api';
import { AlarmModalComponent } from '../components/alarm-modal/alarm-modal.component';

interface MyItem {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

type AlarmSeverity = 'low' | 'medium' | 'high';

type AlarmType =  'AreaIncrease' | 'AreaDecrease' | 'AreaChangePrediction';

export interface Alarm {
  id: number;
  title: string;
  subtitle?: string;
  isMultilineSubtitle?: boolean,
  severity: AlarmSeverity;
  type: AlarmType;
  lessThanThreshold?: number | null;
  moreThanThreshold?: number | null;
  description: string;
  date: string;
  lat: number;
  lng: number;
  estimatedArea?: number;
  canDelete?: boolean;
}

@Component({
  selector: 'eco-theme-test',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TableComponent,
    TablePaginatorComponent,
    ChipComponent,
    IconComponent,
    TableFilterComponent,
    HeaderComponent,
    FileUploadComponent,
    CardListComponent
],
  providers: [{ provide: BACK_ROUTES, useValue: [] }],
  templateUrl: './theme-test.component.html',
  styleUrl: './theme-test.component.scss',
})
export class ThemeTestComponent implements OnInit, OnDestroy {
  tableData = signal<MyItem[]>([]);
  totalItems = signal<number>(0);
  tableConfig = signal<TableConfig<MyItem>>({ columns: [], loading: false });

  currentPageIndex = signal(0);
  currentPageSize = signal(10);
  currentSearchText = signal('');

  alert = alert;
  chipStatuses: ChipStatus[] = ['active', 'inactive', 'completed', 'in-progress', 'new', 'closed', 'sanitary', 'unsanitary', 'warning', 'info', 'neutral', 'black', 'grey'];
  isDisabled = signal(true);

  private queryParams$$ = new Subject<FilterEvent>();
  private destroy$$ = new Subject<void>();

  private dialog = inject(MatDialog);

  icons = ECO_ICONS;

  roles = signal([
    { value: 'admin', label: 'Администратор' },
    { value: 'chief', label: 'Начелник' },
    { value: 'employee', label: 'Службеник' },
    { value: 'trainee', label: 'Приправник' },
  ]);

  filters: FilterFieldConfig[] = [
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: 'active', label: 'активан' },
        { value: 'blocked', label: 'блокиран' },
      ],
    },
    {
      key: 'roles',
      label: 'Роле',
      type: 'multiselect',
      options: [
        { value: 'active', label: 'активан' },
        { value: 'blocked', label: 'блокиран' },
      ],
    },
  ];

  constructor() {
    this.tableConfig.set({
      columns: [
        { key: 'id', label: of('ID') },
        { key: 'name', label: of('Ime') },
        {
          key: 'status',
          label: of('Status'),
          type: 'badge',
          align: 'center',
          badgeConfig: {
            getValue: row => row.status,
            getClass: row => `${row.status}`,
            getIcon: () => 'circle',
          },
        },
        {
          key: 'actions',
          label: of('Akcije'),
          type: 'actions',
          width: '10%',
          align: 'center',
          actions: [{ icon: 'edit', onClick: row => console.log('Edit', row) }],
        },
      ],
      loading: false,
      emptyMessage: of('Nema rezultata po zadatom upitu.'),
    });

    this.queryParams$$.pipe(debounceTime(50), takeUntil(this.destroy$$)).subscribe(event => {
      this.loadData(event);
    });
  }

  ngOnInit(): void {
    this.emitQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
    this.emitQueryParams();
  }

  private emitQueryParams(): void {
    const event: FilterEvent = {
      pageIndex: this.currentPageIndex(),
      pageSize: this.currentPageSize(),
    };
    this.queryParams$$.next(event);
  }

  loadData(event: FilterEvent): void {
    this.tableConfig.update(config => ({ ...config, loading: true }));

    // Simulating API call:
    setTimeout(() => {
      const mockData: MyItem[] = Array.from({ length: event.pageSize }, (_, i) => ({
        id: i + 1 + event.pageIndex * event.pageSize,
        name: `Stavka ${i + 1 + event.pageIndex * event.pageSize}`,
        status: ['active', 'inactive'][i % 2] as 'active' | 'inactive',
      }));

      this.tableData.set(mockData);
      this.totalItems.set(100);
      this.tableConfig.update(config => ({ ...config, loading: false }));
    }, 500);
  }

  onFilter(value: unknown) {
    console.log('FILTER:', value);
  }

  // ── Mockup podaci ────────────────────────────────────────────────────────────
  mockData = signal<Alarm[]>([
    {
      id: 1,
      title: 'Deponija Rakovica - Sektor B',
      severity: 'low',
      type: 'AreaIncrease',
      description: 'Prag povećanja površine > 100%. Površina deponije povećana za 460 m2.',
      date: 'jun 2025.',
      lat: 44.7625,
      lng: 20.4217,
      estimatedArea: 860,
      canDelete: true,
    },
    {
      id: 2,
      title: 'Nova Deponija Zvezdara',
      severity: 'medium',
      type: 'AreaChangePrediction',
      description: 'Predikcija ukazuje na visoku verovatnoću od 80% širenja deponije.',
      date: 'jun 2025.',
      lat: 44.7866,
      lng: 20.5089,
      canDelete: false,
    },
    {
      id: 3,
      title: 'Deponija Barajevo',
      severity: 'high',
      type: 'AreaChangePrediction',
      description: 'Predikcija ukazuje na srednju verovatnoću od 65% širenja deponije.',
      date: 'jun 2025.',
      lat: 44.555,
      lng: 20.3667,
      canDelete: true,
    },
    {
      id: 4,
      title: 'Deponija Voždovac - Istočni deo',
      severity: 'low',
      type: 'AreaDecrease',
      description: 'Prag smanjene površine < 50%. Površina deponije smanjena za 100 m2.',
      date: 'jun 2025.',
      lat: 44.765,
      lng: 20.51,
      estimatedArea: 400,
      canDelete: true,
    },
    {
      id: 5,
      title: 'Multiline text',
      subtitle: 'The quick brown fox jumps over the lazy dog\n-Multiline-\nThe quick brown fox jumps over the lazy dog',
      isMultilineSubtitle: true,
      severity: 'low',
      type: 'AreaIncrease',
      lessThanThreshold: 0.2,
      moreThanThreshold: 0.1,
      description: 'The quick brown fox jumps over the lazy dog\n-Multiline-\nThe quick brown fox jumps over the lazy dog',
      date: 'jun 2025.',
      lat: 44.7625,
      lng: 20.4217,
      estimatedArea: 860,
      canDelete: true,
    },
    {
      id: 6,
      title: 'Inline text',
      subtitle: 'The quick brown fox jumps over the lazy dog\n-Inline-\nThe quick brown fox jumps over the lazy dog',
      severity: 'medium',
      moreThanThreshold: 0.2,
      type: 'AreaChangePrediction',
      description: 'The quick brown fox jumps over the lazy dog\n-Inline-\nThe quick brown fox jumps over the lazy dog',
      date: 'jun 2025.',
      lat: 44.7866,
      lng: 20.5089,
      canDelete: false,
    },
  ]);

  alarmLabels: Record<AlarmType, string> = {
    AreaIncrease: 'Prag povećanja površine',
    AreaChangePrediction: 'Prediktivni alarm',
    AreaDecrease: 'Smanjenje površine',
  };

  // ── Konfiguracija kartice ────────────────────────────────────────────────────

  cardConfig: CardListConfig<Alarm> = {
    selectable: true,
    clickable: true,

    getSeverity: (row): CardSeverity => {
      const map: Record<AlarmSeverity, CardSeverity> = {
        low: 'blocked',
        medium: 'warning',
        high: 'warning',
      };

      return map[row.severity] ?? 'warning';
    },

    getTitle: row => of(row.title),

    getDescription: row => of(row.description),

    getIsMultilineDescription: row => row.isMultilineSubtitle ?? false,

    badges: [
      {
        // Tip alarma
        getValue: row => {
          return of(this.alarmLabels[row.type] ?? row.type);
        },
        getClass: () => 'neutral',
      },
      {
        // Severity chip
        getValue: row => of(row.severity),
        getClass: row => this.getChipStatusForAlarm(row.severity),
      },
    ],

    meta: [
      {
        icon: 'calendar',
        getValue: row => row.date,
      },
      {
        icon: 'gps',
        getValue: row => `${row.lat}, ${row.lng}`,
      },
      {
        label: 'Procenjena površina',
        show: row => !!row.canDelete,
        getValue: row => (row.estimatedArea ? `${row.estimatedArea} m2` : null),
      },
    ],

    actions: [
      {
        icon: 'eye',
        tooltip: 'Pregled',
        onClick: (row: Alarm) => this.openModal(row),
      },
      {
        icon: 'delete',
        tooltip: 'Obriši',
        show: row => !!row.canDelete,
        onClick: row => console.log('Obriši:', row),
      },
    ],
  };

    openModal(data: Alarm): void {
      console.log('Pregled:', data);

      this.dialog.open(ModalComponent, {
        data: {
          title: of(data.title),
          subtitle: of(data.subtitle),
          isMultilineSubtitle: data.isMultilineSubtitle,
          severity: data.canDelete ? 'delete' : 'warning',
          chipHeader: [
            {
              icon: this.getAlarmTypeIcon(data.type),
              text: of(this.alarmLabels[data.type] ?? data.type),
              status: 'neutral',
            },
            {
              text: of(data.severity?.toLocaleLowerCase()),
              status: this.getChipStatusForAlarm(data.severity ?? 'Unknown'),
            },
          ],
          component: AlarmModalComponent,
          mode: 'view',
          data: { ...data },
        },
      });
  }

  getChipStatusForAlarm(severity: AlarmSeverity): ChipStatus {
    switch (severity) {
      case 'low':
        return 'sanitary';
      case 'medium':
        return 'unsanitary';
      case 'high':
        return 'warning';
      default:
        return 'neutral';
    }
  }

  getAlarmTypeIcon(type: AlarmType): EcoIcon {
    return type === 'AreaChangePrediction' ? 'warning-yellow' : 'chart';
  }

  // ── Selekcija ────────────────────────────────────────────────────────────────
  onSelect(event: { _original: Alarm }): void {
    console.log('Selektovano:', event._original);
  }
}
