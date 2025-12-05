import { Component, inject, signal } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

interface notifications {
  id: number;
  icon: string;
  color: string;
  title: string;
  time: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  title: string;
  link: string;
  new?: boolean;
}


@Component({
  selector: 'eco-header',
  standalone: true,
  imports: [
    MatDividerModule,
    RouterModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
 private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  title = signal('');
  subtitle = signal('');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.route;
      while (route.firstChild) route = route.firstChild;

      const data = route.snapshot.data;
      if (data) {
        this.title.set(this.translate.instant(data['title']));
        this.subtitle.set(this.translate.instant(data['subtitle']));
      }
    });
  }

}
