import { Component, input } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'eco-header',
  standalone: true,
  imports: [
    MatDividerModule,
    RouterModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title = input<string>('');
  subtitle = input<string>('');
}
