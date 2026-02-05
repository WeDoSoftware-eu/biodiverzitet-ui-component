# Map Component

## Installation

### Prerequisites

```bash
npm install leaflet leaflet.markercluster
npm install --save-dev @types/leaflet
```

### CSS Dependencies

Add to your `angular.json`:

```json
"styles": [
  "node_modules/leaflet/dist/leaflet.css",
  "node_modules/leaflet.markercluster/dist/MarkerCluster.css",
  "node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css"
]
```

Or import in your global styles:

````scss
@import 'leaflet/dist/leaflet.css';
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { MapComponent, MapMarker } from './map.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MapComponent],
  template: `
    <eco-map
      [markers]="markers"
      [center]="[40.7128, -74.006]"
      [zoom]="12"
      (markerClick)="onMarkerClick($event)"
    />
  `,
})
export class ExampleComponent {
  markers: MapMarker[] = [
    {
      id: 1,
      lat: 40.7128,
      lng: 24.006,
      title: 'New Now',
      description: 'Novi Sad',
      state: 'active',
    },
    {
      id: 2,
      lat: 40.7589,
      lng: 23.9851,
      title: 'Belgrade',
      state: 'new',
    },
  ];

  onMarkerClick(marker: MapMarker) {
    console.log('Marker clicked:', marker);
  }
}
````

## Handling Events

```typescript
@Component({
  template: `
    <eco-map
      [markers]="markers"
      [polygons]="polygons"
      (markerClick)="onMarkerClick($event)"
      (polygonClick)="onPolygonClick($event)"
      (mapClick)="onMapClick($event)"
    />
  `,
})
export class MyComponent {
  onMarkerClick(marker: MapMarker) {
    console.log('Clicked marker:', marker.title);
    // Open details panel, navigate, etc.
  }

  onPolygonClick(polygon: MapPolygon) {
    console.log('Clicked polygon:', polygon.title);
  }

  onMapClick(event: L.LeafletMouseEvent) {
    console.log('Clicked at:', event.latlng);
    // Add new marker at clicked location
  }
}
```
