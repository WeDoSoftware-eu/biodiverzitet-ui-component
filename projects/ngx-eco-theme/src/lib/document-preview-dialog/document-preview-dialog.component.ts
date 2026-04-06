import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';

export interface DocumentPreviewDialogData {
  url: string;
  name: string;
  mimeType: string;
}

@Component({
  selector: 'eco-document-preview-dialog',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './document-preview-dialog.component.html',
  styleUrl: './document-preview-dialog.component.scss',
})
export class DocumentPreviewDialogComponent {
  private dialogRef = inject(MatDialogRef<DocumentPreviewDialogComponent>);
  private sanitizer = inject(DomSanitizer);
  readonly data = inject<DocumentPreviewDialogData>(MAT_DIALOG_DATA);
  private readonly _injectedI18n = inject(ECO_THEME_I18N, { optional: true });
  i18n = this._injectedI18n
    ? { ...DEFAULT_ECO_THEME_I18N, ...this._injectedI18n }
    : DEFAULT_ECO_THEME_I18N;

  readonly safePdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.data.url
  );
  readonly safeImageUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(this.data.url);

  get isPdf(): boolean {
    return this.data.mimeType === 'application/pdf';
  }

  get isImage(): boolean {
    return this.data.mimeType.startsWith('image/');
  }

  close(): void {
    this.dialogRef.close();
  }
}
