export type PaperSize = 'A4' | 'A3';
export type Orientation = 'portrait' | 'landscape';
export type PrintScale = '1:500' | '1:1000' | '1:2500' | '1:5000' | '1:10000' | '1:25000';
export type PrintDpi = 96 | 150 | 300;

export interface PrintSettings {
  paperSize: PaperSize;
  orientation: Orientation;
  scale: PrintScale;
  dpi: PrintDpi;
}
