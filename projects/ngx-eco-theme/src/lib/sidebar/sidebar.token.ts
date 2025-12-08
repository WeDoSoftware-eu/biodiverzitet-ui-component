import { InjectionToken } from '@angular/core';
import { NavItem } from './nav-item/nav-item.model';

export const SIDEBAR_ITEMS = new InjectionToken<NavItem[]>('SIDEBAR_ITEMS');
