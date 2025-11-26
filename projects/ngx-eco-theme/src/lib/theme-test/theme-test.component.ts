import { Component } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eco-theme-test',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './theme-test.component.html',
  styleUrl: './theme-test.component.scss',
})
export class ThemeTestComponent {}
