export interface UtmLegendItem {
  name: string;
  color: string;
  isOverlap: boolean;
}

/** Color lookup for the 8 taxa groups. Names are the consuming app's responsibility (i18n). */
export const UTM_GRUPA_COLORS: Record<string, string> = {
  beskicmenjaci: '#8B4513',
  botanika: '#228B22',
  gljive: '#9370DB',
  insekti: '#FF8C00',
  ptice: '#4169E1',
  ribe: '#20B2AA',
  sisari: '#DC143C',
  'vodozemci i gmizavci': '#FFD700',
};

export const UTM_OVERLAP_COLOR = '#808080';

/** @deprecated Use `UTM_GRUPA_COLORS` and translate names in the consuming app via `UTM.Grupe.<key>`. */
export const UTM_GRUPA_MAP: Record<string, { name: string; color: string }> = {
  beskicmenjaci: { name: 'Бескичмењаци', color: UTM_GRUPA_COLORS['beskicmenjaci'] },
  botanika: { name: 'Ботаника', color: UTM_GRUPA_COLORS['botanika'] },
  gljive: { name: 'Гљиве', color: UTM_GRUPA_COLORS['gljive'] },
  insekti: { name: 'Инсекти', color: UTM_GRUPA_COLORS['insekti'] },
  ptice: { name: 'Птице', color: UTM_GRUPA_COLORS['ptice'] },
  ribe: { name: 'Рибе', color: UTM_GRUPA_COLORS['ribe'] },
  sisari: { name: 'Сисари', color: UTM_GRUPA_COLORS['sisari'] },
  'vodozemci i gmizavci': {
    name: 'Водоземци и гмизавци',
    color: UTM_GRUPA_COLORS['vodozemci i gmizavci'],
  },
};

/** @deprecated Use `UTM_OVERLAP_COLOR` and translate via `UTM.OverlapEntry`. */
export const UTM_OVERLAP_ENTRY: { name: string; color: string } = {
  name: 'Преклапање (2+ група)',
  color: UTM_OVERLAP_COLOR,
};
