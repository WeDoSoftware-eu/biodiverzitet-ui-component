export type LegendDisplayMode = 'basic' | 'advanced';

export interface LegendColorChangeEvent {
  key: string;
  color: string;
}

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
  colorKey?: string;
  colorEditable?: boolean;
  colorValue?: string;
}
