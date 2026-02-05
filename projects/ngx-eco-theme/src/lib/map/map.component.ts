import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  input,
  output,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';

/* =======================
   Type Extensions
======================= */
declare module 'leaflet' {
  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
}

/* =======================
   Interfaces
======================= */
export type MarkerState = 'active' | 'closed' | 'new';

export interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  state?: MarkerState;
  icon?: L.Icon;
}

export interface MapLayer {
  name: string;
  url: string;
  attribution?: string;
  maxZoom?: number;
  thumbnail: string;
}

export interface MapPolygon {
  id: string | number;
  coordinates: [number, number][];
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  title?: string;
  description?: string;
}

interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/* =======================
   Component
======================= */

@Component({
  selector: 'eco-map',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  public i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  markers = input<MapMarker[]>([]);
  polygons = input<MapPolygon[]>([]);
  center = input<[number, number]>([51.505, -0.09]);
  zoom = input<number>(13);
  height = input<string>('600px');
  width = input<string>('100%');

  showLocateButton = input<boolean>(true);
  showZoomControls = input<boolean>(true);
  showFullscreenButton = input<boolean>(true);
  showLayersButton = input<boolean>(true);
  showSearchBox = input<boolean>(true);
  showFilterButton = input<boolean>(true);
  enableClustering = input<boolean>(true);

  markerClick = output<MapMarker>();
  mapClick = output<L.LeafletMouseEvent>();
  polygonClick = output<MapPolygon>();

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private markersLayer!: L.LayerGroup;
  private markerClusterGroup!: L.MarkerClusterGroup | L.LayerGroup;
  private polygonsLayer!: L.LayerGroup;
  private currentTileLayer!: L.TileLayer;
  private defaultIcon!: L.Icon;
  private stateIconsCache = new Map<MarkerState, L.Icon>();
  private resizeTimeout: number | undefined;
  private mapInitialized = false;
  private clusteringAvailable = false;

  filteredMarkers: MapMarker[] = [];
  searchQuery = '';
  showLayersPanel = false;

  mapAttribution = '&copy; Google Maps';
  baseLayers: MapLayer[] = [
    {
      name: this.i18n.map.layers.street,
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: this.mapAttribution,
      thumbnail: './assets/lib-images/street.png',
      maxZoom: 20,
    },
    {
      name: this.i18n.map.layers.satellite,
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: this.mapAttribution,
      thumbnail: './assets/lib-images/satellite.png',
      maxZoom: 20,
    },
    {
      name: this.i18n.map.layers.terrain,
      url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      attribution: this.mapAttribution,
      thumbnail: './assets/lib-images/terrain.png',
      maxZoom: 20,
    },
  ];

  activeLayer: MapLayer = this.baseLayers[0];

  constructor() {
    effect(() => {
      this.filteredMarkers = [...this.markers()];
      if (this.mapInitialized) {
        this.updateMarkers();
      }
    });

    effect(() => {
      if (this.mapInitialized) {
        this.updatePolygons();
      }
    });
  }

  ngOnInit(): void {
    this.initializeDefaultIcon();
    this.initializeStateIcons();
    this.initializeClusterGroup();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.scheduleMapFix();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.map?.remove();
    this.stateIconsCache.clear();
    this.markerClusterGroup?.clearLayers();
  }

  /* =======================
     Map Init
  ======================= */

  private initMap(): void {
    if (!this.mapContainer) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center(),
      zoom: this.zoom(),
      zoomControl: false,
    });

    this.currentTileLayer = L.tileLayer(this.activeLayer.url, {
      attribution: this.activeLayer.attribution,
      maxZoom: this.activeLayer.maxZoom,
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.polygonsLayer = L.layerGroup().addTo(this.map);

    this.updatePolygons();
    this.updateMarkers();

    this.map.on('click', e => this.mapClick.emit(e));

    this.map.whenReady(() => {
      this.mapInitialized = true;
      this.fixMapSize();
    });
  }

  /* =======================
     Clustering
  ======================= */

  private initializeClusterGroup(): void {
    // Proveri da li je markerClusterGroup dostupan
    if (typeof L.markerClusterGroup !== 'function') {
      console.warn('leaflet.markercluster plugin is not loaded, clustering disabled');
      this.clusteringAvailable = false;
      this.markerClusterGroup = L.layerGroup();
      return;
    }

    this.clusteringAvailable = true;
    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 18,

      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        let size = 'small';

        if (count > 100) {
          size = 'large';
        } else if (count > 10) {
          size = 'medium';
        }

        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(40, 40),
        });
      },
    });
  }

  /* =======================
     Icons
  ======================= */

  private initializeDefaultIcon(): void {
    this.defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  private initializeStateIcons(): void {
    const states: MarkerState[] = ['new', 'active', 'closed'];

    states.forEach(state => {
      const icon = L.icon({
        iconUrl: `./assets/icons-svg/state-${state}.svg`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      this.stateIconsCache.set(state, icon);
    });
  }

  private getIconForMarker(markerData: MapMarker): L.Icon {
    if (markerData.state) {
      const stateIcon = this.stateIconsCache.get(markerData.state);
      if (stateIcon) {
        return stateIcon;
      }
    }

    if (markerData.icon) {
      return markerData.icon;
    }

    return this.defaultIcon;
  }

  /* =======================
     Markers
  ======================= */

  private updateMarkers(): void {
    if (!this.markersLayer || !this.markerClusterGroup) {
      console.warn('Layers not initialized yet');
      return;
    }

    this.markersLayer.clearLayers();
    this.markerClusterGroup.clearLayers();

    if (this.map.hasLayer(this.markerClusterGroup)) {
      this.map.removeLayer(this.markerClusterGroup);
    }

    this.filteredMarkers.forEach(markerData => {
      if (isNaN(markerData.lat) || isNaN(markerData.lng)) return;

      const icon = this.getIconForMarker(markerData);

      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: icon,
      });

      // marker.bindPopup(`
      //   <div class="marker-popup">
      //     <h3>${markerData.title}</h3>
      //     ${markerData.description ? `<p>${markerData.description}</p>` : ''}
      //     ${markerData.state ? `<p><strong>State:</strong> ${markerData.state}</p>` : ''}
      //   </div>
      // `);

      marker.on('click', () => this.markerClick.emit(markerData));

      if (this.enableClustering() && this.clusteringAvailable) {
        this.markerClusterGroup.addLayer(marker);
      } else {
        marker.addTo(this.markersLayer);
      }
    });

    if (
      this.enableClustering() &&
      this.clusteringAvailable &&
      !this.map.hasLayer(this.markerClusterGroup)
    ) {
      this.map.addLayer(this.markerClusterGroup);
    }
  }

  /* =======================
     Polygons
  ======================= */

  private updatePolygons(): void {
    this.polygonsLayer.clearLayers();

    this.polygons().forEach(polygonData => {
      const polygon = L.polygon(polygonData.coordinates, {
        color: polygonData.color ?? '#3388ff',
        fillColor: polygonData.fillColor ?? '#3388ff',
        fillOpacity: polygonData.fillOpacity ?? 0.2,
        weight: polygonData.weight ?? 3,
      });

      if (polygonData.title) {
        polygon.bindPopup(`
          <div class="polygon-popup">
            <h3>${polygonData.title}</h3>
            ${polygonData.description ? `<p>${polygonData.description}</p>` : ''}
          </div>
        `);
      }

      polygon.on('click', () => this.polygonClick.emit(polygonData));
      polygon.addTo(this.polygonsLayer);
    });
  }

  /* =======================
     Utils
  ======================= */

  private scheduleMapFix(): void {
    [0, 100, 300, 600, 1000].forEach(t => setTimeout(() => this.fixMapSize(), t));
  }

  fixMapSize(): void {
    this.map?.invalidateSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = window.setTimeout(() => this.fixMapSize(), 200);
  }

  /* =======================
     Search
  ======================= */

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredMarkers = query
      ? this.markers().filter(
          m => m.title.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)
        )
      : [...this.markers()];

    this.updateMarkers();
  }

  /* =======================
     Layers
  ======================= */

  switchLayer(layer: MapLayer): void {
    this.activeLayer = layer;
    this.map.removeLayer(this.currentTileLayer);

    this.currentTileLayer = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: layer.maxZoom,
    }).addTo(this.map);

    this.showLayersPanel = false;
  }

  toggleLayersPanel(): void {
    this.showLayersPanel = !this.showLayersPanel;
  }

  /* =======================
     Controls
  ======================= */

  zoomIn(): void {
    this.map.zoomIn();
  }

  zoomOut(): void {
    this.map.zoomOut();
  }

  toggleFullscreen(): void {
    const mapElement = this.mapContainer.nativeElement as FullscreenHTMLElement;
    const errorFullScreen = 'Error attempting to enable fullscreen:';

    if (!document.fullscreenElement) {
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen().catch(err => {
          console.error(errorFullScreen, err);
        });
      } else if (mapElement.webkitRequestFullscreen) {
        mapElement.webkitRequestFullscreen().catch(err => {
          console.error(errorFullScreen, err);
        });
      } else if (mapElement.msRequestFullscreen) {
        mapElement.msRequestFullscreen().catch(err => {
          console.error(errorFullScreen, err);
        });
      }

      setTimeout(() => this.fixMapSize(), 100);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    }
  }

  locateMe(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.map.setView([lat, lng], 16);

        const userMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div style="background: #4285f4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        }).addTo(this.map);
        userMarker.bindPopup('You are here!').openPopup();
      },
      (error: GeolocationPositionError) => {
        alert('Unable to retrieve your location');
        console.error(error);
      }
    );
  }
}
