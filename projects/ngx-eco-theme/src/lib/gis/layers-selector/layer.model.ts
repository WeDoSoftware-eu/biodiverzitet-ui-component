export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type?: 'wms' | 'wfs' | 'vector';
  opacity?: number;
}
