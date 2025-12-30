import { Injectable, signal, WritableSignal, computed, DestroyRef, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type FilterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | FilterValue[]
  | { [key: string]: FilterValue };
type FilterState = Record<string, FilterValue>;

@Injectable({ providedIn: 'root' })
export class TableFilterStoreService {
  private store = new Map<string, WritableSignal<FilterState>>();
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
          const value = JSON.parse(decodeURIComponent(params[paramKey])) as FilterState;
          if (this.store.has(id)) {
            this.store.get(id)!.set(value);
          }
        } catch (e) {
          console.warn(`Failed to parse filter param: ${paramKey}`, e);
        }
      }
    });
  }

  private updateUrl(id: string, value: FilterState): void {
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

  get<T extends FilterState = FilterState>(id: string): WritableSignal<T> {
    if (!this.store.has(id)) {
      const urlValue = this.loadFromUrl(id);
      this.store.set(id, signal(urlValue));
    }
    return this.store.get(id)! as WritableSignal<T>;
  }

  private loadFromUrl(id: string): FilterState {
    const paramKey = this.key(id);
    const params = this.route.snapshot.queryParams;

    if (params[paramKey]) {
      try {
        return JSON.parse(decodeURIComponent(params[paramKey])) as FilterState;
      } catch (e) {
        console.warn(`Failed to parse URL filter for ${id}`, e);
        return {};
      }
    }
    return {};
  }

  set<T extends FilterState = FilterState>(id: string, value: Partial<T>): void {
    const current = this.get<T>(id)();
    const merged = { ...current, ...value } as T;
    this.get<T>(id).set(merged);
    this.updateUrl(id, merged);
  }

  clear(id: string): void {
    const current = this.get(id)();
    const preserved: FilterState = current['searchText']
      ? { searchText: current['searchText'] }
      : {};
    this.get(id).set(preserved);
    this.updateUrl(id, preserved);
  }

  activeCount(id: string) {
    return computed(
      () =>
        Object.values(this.get(id)()).filter((v): v is NonNullable<FilterValue> =>
          Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined
        ).length
    );
  }

  getShareableUrl(id: string): string {
    const value = this.get(id)();
    const params = { [this.key(id)]: encodeURIComponent(JSON.stringify(value)) };

    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });

    return window.location.origin + this.router.serializeUrl(urlTree);
  }
}
