import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapCoordinates, ScaleBarConfig } from './map-status-bar.model';

@Component({
  selector: 'eco-map-status-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-status-bar.component.html',
  styleUrls: ['./map-status-bar.component.scss']
})
export class MapStatusBarComponent {
  epsgCode = input<string>('EPSG:32634');
  coordinates = input<MapCoordinates | null>(null);
  resolution = input<number>(1);

  scaleBarConfig = computed<ScaleBarConfig>(() => {
    return this.calculateScaleBar(this.resolution());
  });

  formattedEasting = computed(() => {
    const coords = this.coordinates();
    if (!coords) return '-';
    return `${Math.round(coords.easting).toLocaleString('sr-RS')} E`;
  });

  formattedNorthing = computed(() => {
    const coords = this.coordinates();
    if (!coords) return '-';
    return `${Math.round(coords.northing).toLocaleString('sr-RS')} N`;
  });

  private calculateScaleBar(resolution: number): ScaleBarConfig {
    // Maksimalna širina scale bara u pikselima
    const maxWidth = 100;

    // Maksimalna distanca u metrima za datu rezoluciju
    const maxDistance = resolution * maxWidth;

    let distance: number;
    let unit: 'm' | 'km';

    if (maxDistance >= 1000) {
      // Koristi kilometre
      distance = maxDistance / 1000;
      const magnitude = Math.pow(10, Math.floor(Math.log10(distance)));
      distance = Math.floor(distance / magnitude) * magnitude;
      if (distance === 0) distance = magnitude;
      unit = 'km';
    } else {
      // Koristi metre
      distance = maxDistance;
      const magnitude = Math.pow(10, Math.floor(Math.log10(distance)));
      distance = Math.floor(distance / magnitude) * magnitude;
      if (distance === 0) distance = magnitude;
      unit = 'm';

      // Konvertuj u km ako je >= 1000m
      if (distance >= 1000) {
        distance = distance / 1000;
        unit = 'km';
      }
    }

    // Izračunaj stvarnu širinu u pikselima
    const distanceInMeters = unit === 'km' ? distance * 1000 : distance;
    const widthPx = Math.round(distanceInMeters / resolution);

    return {
      scaleValue: distance,
      unit,
      label: `${distance} ${unit}`,
      widthPx
    };
  }
}
