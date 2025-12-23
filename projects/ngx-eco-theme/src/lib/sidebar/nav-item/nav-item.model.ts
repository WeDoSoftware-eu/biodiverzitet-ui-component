import { EcoIcon } from '../../icon/icon.component';

export interface NavItem {
  displayName: string;
  iconName?: EcoIcon;
  route?: string;
  children?: NavItem[];
}
