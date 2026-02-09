export interface HoverFeatureInfo {
  layerId: string;
  layerDisplayName: string;
  featureName: string | null;
  featureType: string | null;
  registrationNumber: string | null;
}

export interface HoverTooltipData {
  features: HoverFeatureInfo[];
  position: {
    x: number;
    y: number;
  };
  showAbove: boolean;
}
