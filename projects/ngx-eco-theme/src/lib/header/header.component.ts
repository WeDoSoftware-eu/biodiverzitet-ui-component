import { Component, input } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EcoIcon, IconComponent } from '../icon/icon.component';

interface profileItems {
  id: number;
  title: string;
  link: string;
  icon: EcoIcon;
}

@Component({
  selector: 'eco-header',
  standalone: true,
  imports: [MatDividerModule, RouterModule, MatMenuModule, MatToolbarModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title = input<string>('');
  subtitle = input<string>('');

  profileLinks: profileItems[] = [
    {
      id: 1,
      title: 'My Profile',
      link: '/',
      icon: 'cancel',
    },
    {
      id: 2,
      title: 'Log Out',
      link: '/',
      icon: 'cancel',
    },
  ];
}
