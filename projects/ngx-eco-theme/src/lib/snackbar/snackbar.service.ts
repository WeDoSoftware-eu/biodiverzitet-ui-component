import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar.component';

export type SnackbarType = 'success' | 'warning' | 'info' | 'error';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
  action?: string;
}

export interface SnackbarOptions {
  action?: string;
  duration?: number;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    panelClass: ['custom-snackbar'],
  };

  success(message: string, options?: SnackbarOptions): MatSnackBarRef<SnackbarComponent> {
    return this.show(message, 'success', options);
  }

  warning(message: string, options?: SnackbarOptions): MatSnackBarRef<SnackbarComponent> {
    return this.show(message, 'warning', options);
  }

  info(message: string, options?: SnackbarOptions): MatSnackBarRef<SnackbarComponent> {
    return this.show(message, 'info', options);
  }

  error(message: string, options?: SnackbarOptions): MatSnackBarRef<SnackbarComponent> {
    return this.show(message, 'error', options);
  }

  show(
    message: string,
    type: SnackbarType = 'info',
    options?: SnackbarOptions
  ): MatSnackBarRef<SnackbarComponent> {
    const config: MatSnackBarConfig<SnackbarData> = {
      ...this.defaultConfig,
      duration: options?.duration ?? this.defaultConfig.duration,
      horizontalPosition: options?.horizontalPosition ?? this.defaultConfig.horizontalPosition,
      verticalPosition: options?.verticalPosition ?? this.defaultConfig.verticalPosition,
      data: {
        message,
        type,
      },
    };

    return this.snackBar.openFromComponent(SnackbarComponent, config);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}
