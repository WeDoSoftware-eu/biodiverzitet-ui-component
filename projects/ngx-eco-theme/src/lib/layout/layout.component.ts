import { Component, input } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'eco-layout',
  standalone: true,
  imports: [MatDividerModule, RouterModule, HeaderComponent, MatSidenavModule, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  brandingTitle = input<string>('');
  title = input<string>('');
  subtitle = input<string>('');
}
