export interface UtmLegendItem {
  name: string;
  color: string;
  isOverlap: boolean;
}

export const UTM_GRUPA_MAP: Record<string, { name: string; color: string }> = {
  beskicmenjaci: { name: 'Бескичмењаци', color: '#8B4513' },
  botanika: { name: 'Ботаника', color: '#228B22' },
  gljive: { name: 'Гљиве', color: '#9370DB' },
  insekti: { name: 'Инсекти', color: '#FF8C00' },
  ptice: { name: 'Птице', color: '#4169E1' },
  ribe: { name: 'Рибе', color: '#20B2AA' },
  sisari: { name: 'Сисари', color: '#DC143C' },
  'vodozemci i gmizavci': { name: 'Водоземци и гмизавци', color: '#FFD700' },
};

export const UTM_OVERLAP_ENTRY: { name: string; color: string } = {
  name: 'Преклапање (2+ група)',
  color: '#808080',
};
