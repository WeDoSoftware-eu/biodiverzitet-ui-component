export type MeasurementType = 'point' | 'line' | 'polygon';

export interface MeasurementItem {
  id: number;
  type: MeasurementType;
  label: string;
  value: string;
}
