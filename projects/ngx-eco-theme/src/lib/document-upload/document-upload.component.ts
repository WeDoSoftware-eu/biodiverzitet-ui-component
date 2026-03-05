import { Component, computed, inject, input, model, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';

@Component({
  selector: 'eco-document-upload',
  standalone: true,
  imports: [AsyncPipe, IconComponent],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.scss',
})
export class DocumentUploadComponent {
  private readonly _injectedI18n = inject(ECO_THEME_I18N, { optional: true });
  i18n = this._injectedI18n
    ? { ...DEFAULT_ECO_THEME_I18N, ...this._injectedI18n }
    : DEFAULT_ECO_THEME_I18N;

  files = model<File[]>([]);
  maxFileSize = input<number>(3 * 1024 * 1024);

  isDragOver = signal(false);
  fileError = signal<string | null>(null);
  readonly maxFileSizeMb = computed(() => this.maxFileSize() / (1024 * 1024));

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  removeFile(index: number): void {
    this.files.update(files => files.filter((_, i) => i !== index));
    this.fileError.set(null);
  }

  private addFiles(newFiles: File[]): void {
    this.fileError.set(null);
    const valid: File[] = [];
    for (const file of newFiles) {
      if (file.size > this.maxFileSize()) {
        this.fileError.set('fileTooLarge');
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) {
      this.files.update(files => [...files, ...valid]);
    }
  }
}
