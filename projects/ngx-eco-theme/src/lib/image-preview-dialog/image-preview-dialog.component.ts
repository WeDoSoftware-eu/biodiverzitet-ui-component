import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'eco-image-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, IconComponent],
  templateUrl: './image-preview-dialog.component.html',
  styleUrl: './image-preview-dialog.component.scss',
})
export class ImagePreviewDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
}
