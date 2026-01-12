import { Injectable, signal, WritableSignal, DestroyRef, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseFilter } from '../base-table.directive';

@Injectable({ providedIn: 'root' })
export class TableFilterStoreService {
  private store = new Map<string, WritableSignal<BaseFilter>>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.syncFromUrl(params);
    });
  }

  private key(id: string): string {
    return `filter_${id}`;
  }

  private syncFromUrl(params: Params): void {
    Object.keys(params).forEach(paramKey => {
      if (paramKey.startsWith('filter_')) {
        const id = paramKey.replace('filter_', '');
        try {
          const value = JSON.parse(decodeURIComponent(params[paramKey])) as BaseFilter;
          if (this.store.has(id)) {
            this.store.get(id)!.set(value);
          }
        } catch (e) {
          console.warn(`Failed to parse filter param: ${paramKey}`, e);
        }
      }
    });
  }

  private updateUrl(id: string, value: BaseFilter): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    const paramKey = this.key(id);

    if (Object.keys(value).length === 0) {
      delete currentParams[paramKey];
    } else {
      currentParams[paramKey] = encodeURIComponent(JSON.stringify(value));
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  get(id: string): WritableSignal<BaseFilter> {
    if (!this.store.has(id)) {
      const urlValue = this.loadFromUrl(id);
      this.store.set(id, signal(urlValue));
    }
    return this.store.get(id)!;
  }

  private loadFromUrl(id: string): BaseFilter {
    const paramKey = this.key(id);
    const params = this.route.snapshot.queryParams;

    if (params[paramKey]) {
      try {
        return JSON.parse(decodeURIComponent(params[paramKey])) as BaseFilter;
      } catch (e) {
        console.warn(`Failed to parse URL filter for ${id}`, e);
        return {};
      }
    }
    return {};
  }

  set(id: string, value: Partial<BaseFilter>): void {
    const current = this.get(id)();
    const merged = { ...current, ...value };
    this.get(id).set(merged);
    this.updateUrl(id, merged);
  }

  clear(id: string): void {
    const current = this.get(id)();
    const preserved: BaseFilter = current['searchText']
      ? { searchText: current['searchText'] }
      : {};
    this.get(id).set(preserved);
    this.updateUrl(id, preserved);
  }
}
