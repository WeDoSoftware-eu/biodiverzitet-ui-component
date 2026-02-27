import { Observable } from 'rxjs';
import { EcoIcon } from '../icon/icon.component';

export type CardSeverity = 'warning' | 'blocked';

export interface CardMetaItem<T> {
  icon?: EcoIcon;
  label?: string;
  show?: (row: T) => boolean;
  getValue: (row: T) => string | number | null | undefined;
}

export interface CardBadge<T> {
  getValue: (row: T) => Observable<string>;
  getClass: (row: T) => string;
  getIcon?: (row: T) => EcoIcon;
  show?: (row: T) => boolean;
}

export interface CardAction<T> {
  icon: EcoIcon;
  tooltip?: string;
  show?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface CardListConfig<T> {
  /** Resolves the card title */
  getTitle: (row: T) => Observable<string>;

  /** Resolves the main description text */
  getDescription?: (row: T) => Observable<string> | null;

  /** Left-side severity icon */
  getSeverity?: (row: T) => CardSeverity;

  /** Chips shown next to the title */
  badges?: CardBadge<T>[];

  /** Footer metadata row */
  meta?: CardMetaItem<T>[];

  /** Action buttons on the right */
  actions?: CardAction<T>[];

  /** Show a selected highlight on click */
  selectable?: boolean;

  loading?: boolean;
  emptyMessage?: Observable<string>;
}

export interface ProcessedCardBadge {
  value: Observable<string>;
  cssClass: string;
  icon?: EcoIcon;
  visible: boolean;
}

export interface ProcessedCardMeta {
  icon?: EcoIcon;
  label?: string;
  value: string | number | null | undefined;
}

export interface ProcessedCardAction<T> extends CardAction<T> {
  visible: boolean;
}

export interface ProcessedCard<T> {
  _original: T;
  _isSelected: boolean;
  title: Observable<string>;
  description: Observable<string> | null;
  severity: CardSeverity | 'none';
  severityIcon: EcoIcon | null;
  badges: ProcessedCardBadge[];
  meta: ProcessedCardMeta[];
  actions: ProcessedCardAction<T>[];
}
