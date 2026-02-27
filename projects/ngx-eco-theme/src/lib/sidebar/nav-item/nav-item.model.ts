import { Observable } from 'rxjs';
import { EcoIcon } from '../../icon/icon.component';

export interface NavItem {
  displayName?: Observable<string>;
  iconName?: EcoIcon;
  route?: string;
  children?: NavItem[];
}
