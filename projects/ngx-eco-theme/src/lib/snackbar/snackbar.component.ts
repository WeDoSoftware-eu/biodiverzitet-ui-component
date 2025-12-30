import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarData } from './snackbar.service';
import { EcoIcon, IconComponent } from '../icon/icon.component';

@Component({
  selector: 'eco-snackbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, IconComponent],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  readonly data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject(MatSnackBarRef<SnackbarComponent>);

  getIcon(): EcoIcon {
    const icons: Record<string, EcoIcon> = {
      success: 'correct',
      warning: 'warrning',
      info: 'rounded-info',
    };
    return icons[this.data.type] || 'info';
  }
}
