import { Injectable, inject } from '@angular/core';
import { Router, IsActiveMatchOptions } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private router = inject(Router);

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    const options: IsActiveMatchOptions = {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    };

    return this.router.isActive(route, options);
  }
}
