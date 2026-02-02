export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type?: 'wms' | 'wfs' | 'vector';
  opacity?: number;
}

export interface MapLayerGroup {
  id: string;
  name: string;
  layers: MapLayer[];
  expanded: boolean; // false po defaultu - zatvoreno
}
