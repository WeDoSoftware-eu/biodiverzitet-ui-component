export interface LegendItem {
  id: string;
  name: string;
  type: 'fill' | 'line' | 'icon' | 'composite' | 'point';
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  lineDash?: number[];
  iconSvg?: string;
  compositeStyles?: {
    base: { color: string; width: number };
    overlay: { color: string; width: number; lineDash: number[] };
  };
}
