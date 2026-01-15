import { InjectionToken, Signal } from '@angular/core';

export interface AuthUser {
  fullName: Signal<string>;
  email: Signal<string>;
  logout: () => Promise<void>;
}

export const AUTH_USER_TOKEN = new InjectionToken<AuthUser>('AUTH_USER');
