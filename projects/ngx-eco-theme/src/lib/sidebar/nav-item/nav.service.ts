import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private router = inject(Router);

  currentUrl(): string {
    return this.router.url;
  }
}
