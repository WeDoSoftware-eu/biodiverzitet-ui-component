export interface MapCoordinates {
  easting: number;
  northing: number;
}

export interface ScaleBarConfig {
  scaleValue: number;
  unit: 'm' | 'km';
  label: string;
  widthPx: number;
}
