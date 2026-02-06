import { Component, signal, OnInit, OnDestroy } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TableComponent } from '../table/table.component';
import { TablePaginatorComponent } from '../table/table-paginator/table-paginator.component';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FilterEvent, TableConfig } from '../table/table.model';
import { PageEvent } from '@angular/material/paginator';
import { ChipComponent } from '../chip/chip.component';
import { ECO_ICONS, IconComponent } from '../icon/icon.component';
import {
  FilterFieldConfig,
  TableFilterComponent,
} from '../table/table-filter/table-filter.component';
import { HeaderComponent } from '../header/header.component';
// import { MapComponent, MapMarker, MapPolygon } from '../map/map.component'; // COMMENTED OUT

interface MyItem {
  id: number;
  name: string;
  status: 'active' | 'inactive';
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
    // MapComponent, // COMMENTED OUT
  ],
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

  private queryParams$$ = new Subject<FilterEvent>();
  private destroy$$ = new Subject<void>();

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
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Ime' },
        {
          key: 'status',
          label: 'Status',
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
          label: 'Akcije',
          type: 'actions',
          width: '10%',
          align: 'center',
          actions: [{ icon: 'edit', onClick: row => console.log('Edit', row) }],
        },
      ],
      loading: false,
      emptyMessage: 'Nema rezultata po zadatom upitu.',
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

  /* COMMENTED OUT - eco-map not in use, pending team decision on removal
  center: [number, number] = [45.2671, 19.8335];
  zoom: number = 8;
  selectedMarker: MapMarker | null = null;

  juznobacki: string = 'Јужнобанатски';
  wasteSize: string = '50 - 100 m²';

  markers: MapMarker[] = [
    {
      id: 0,
      lat: 45.7297,
      lng: 20.1052,
      title: 'Нови Сад - Ветерник',
      state: 'illegal',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 6,
      district: 'Јужнобачки',
      reportYear: 2021,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 45,
      wasteAmountTons: 5,
      dumpsiteArea: 1,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 1,
      dumpsiteStatus: 1,
      levelOfOrganisation: 1,
    },
    {
      id: 1,
      lat: 45.248,
      lng: 20.045,
      title: 'Вршац - Мало Средиште',
      state: 'sanitary',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 6,
      district: this.juznobacki,
      reportYear: 2020,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 38,
      wasteAmountTons: 4,
      dumpsiteArea: 1,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 3,
      dumpsiteStatus: 2,
      levelOfOrganisation: 1,
    },
    {
      id: 2,
      lat: 45.348,
      lng: 19.716,
      title: 'Сремска Митровица - Засавица',
      state: 'unsanitary',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 7,
      district: 'Сремски',
      reportYear: 2021,
      wasteType: 3,
      wasteTypeLabel: 'Грађевински',
      estimatedAreaM2: 52,
      wasteAmountTons: 6,
      dumpsiteArea: 2,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 2,
      dumpsiteStatus: 1,
      levelOfOrganisation: 2,
    },
    {
      id: 3,
      lat: 44.9726,
      lng: 21.2955,
      title: 'Пожаревац - Пољана',
      state: 'sanitary',
      regions: 4,
      regionLabel: 'Јужна и Источна Србија',
      districts: 2,
      district: 'Браничевски',
      reportYear: 2019,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 72,
      wasteAmountTons: 9,
      dumpsiteArea: 2,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 3,
      dumpsiteStatus: 2,
      levelOfOrganisation: 3,
    },
    {
      id: 4,
      lat: 45.098,
      lng: 21.238,
      title: 'Панчево - Старчево',
      state: 'unsanitary',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 6,
      district: this.juznobacki,
      reportYear: 2020,
      wasteType: 2,
      wasteTypeLabel: 'Индустријски',
      estimatedAreaM2: 48,
      wasteAmountTons: 5,
      dumpsiteArea: 1,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 2,
      dumpsiteStatus: 2,
      levelOfOrganisation: 2,
    },
    {
      id: 5,
      lat: 45.076,
      lng: 21.202,
      title: 'Панчево - Глогањ',
      state: 'illegal',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 6,
      district: this.juznobacki,
      reportYear: 2024,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 35,
      wasteAmountTons: 4,
      dumpsiteArea: 1,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 1,
      dumpsiteStatus: 3,
      levelOfOrganisation: 1,
    },
    {
      id: 6,
      lat: 45.2575,
      lng: 19.773,
      title: 'Рума - Добринци',
      state: 'illegal',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 7,
      district: 'Сремски',
      reportYear: 2024,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 42,
      wasteAmountTons: 5,
      dumpsiteArea: 1,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 1,
      dumpsiteStatus: 1,
      levelOfOrganisation: 2,
    },
    {
      id: 7,
      lat: 45.249,
      lng: 19.698,
      title: 'Шид - Ердевик',
      state: 'sanitary',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 7,
      district: 'Сремски',
      reportYear: 2024,
      wasteType: 3,
      wasteTypeLabel: 'Грађевински',
      estimatedAreaM2: 38,
      wasteAmountTons: 4,
      dumpsiteArea: 1,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 3,
      dumpsiteStatus: 3,
      levelOfOrganisation: 3,
    },
    {
      id: 8,
      lat: 43.556,
      lng: 22.281,
      title: 'Пирот - Темска',
      state: 'unsanitary',
      regions: 4,
      regionLabel: 'Јужна и Источна Србија',
      districts: 6,
      district: 'Пиротски',
      reportYear: 2022,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 65,
      wasteAmountTons: 8,
      dumpsiteArea: 2,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 2,
      dumpsiteStatus: 1,
      levelOfOrganisation: 1,
    },
    {
      id: 9,
      lat: 45.249,
      lng: 19.716,
      title: 'Сремска Митровица - Лаћарак',
      state: 'illegal',
      regions: 2,
      regionLabel: 'Војводина',
      districts: 7,
      district: 'Сремски',
      reportYear: 2023,
      wasteType: 6,
      wasteTypeLabel: 'Мешовити',
      estimatedAreaM2: 55,
      wasteAmountTons: 6,
      dumpsiteArea: 2,
      dumpsiteSizeLabel: this.wasteSize,
      dumpsiteType: 1,
      dumpsiteStatus: 1,
      levelOfOrganisation: 1,
    },
  ];
  nationalParks: MapPolygon[] = [
    {
      id: 'fruska-gora',
      title: 'Fruška Gora',
      description: 'Nacionalni park Fruška Gora',
      coordinates: [
        [45.18, 19.45],
        [45.2, 19.5],
        [45.22, 19.6],
        [45.2, 19.75],
        [45.18, 19.85],
        [45.15, 19.9],
        [45.12, 19.95],
        [45.08, 19.93],
        [45.05, 19.88],
        [45.03, 19.8],
        [45.02, 19.7],
        [45.03, 19.6],
        [45.05, 19.5],
        [45.08, 19.45],
        [45.12, 19.42],
        [45.15, 19.43],
        [45.18, 19.45],
      ],
      color: '#2d5016',
      fillColor: '#4a7c2f',
      fillOpacity: 0.35,
      weight: 3,
    },
    {
      id: 'deliblato',
      title: 'Deliblatska Peščara',
      description: 'Deliblatska Peščara',
      coordinates: [
        [44.95, 21.0],
        [45.1, 21.2],
        [45.05, 21.4],
        [44.9, 21.45],
        [44.8, 21.3],
        [44.85, 21.1],
        [44.95, 21.0],
      ],
      color: '#d4a373',
      fillColor: '#e6c9a8',
      fillOpacity: 0.3,
      weight: 2,
    },
  ];

  onMarkerClick(marker: MapMarker): void {
    this.selectedMarker = marker;
    console.log('Marker clicked:', marker);
  }

  onMapClick(event: any): void {
    console.log('Map clicked at:', event.latlng);
  }
  */
}
