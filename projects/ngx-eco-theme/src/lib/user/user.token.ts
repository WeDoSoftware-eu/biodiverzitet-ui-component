import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthUser {
  fullName: Observable<string>;
  email: Observable<string>;
  logout: () => Promise<void>;
}

export const AUTH_USER_TOKEN = new InjectionToken<AuthUser>('AUTH_USER');
