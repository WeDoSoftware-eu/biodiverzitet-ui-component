import { Component, input, output, OnDestroy, inject, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { FormControl } from '@angular/forms';

interface FilePreview {
  file?: File;
  name: string;
  url: string;
  id?: number | string;
  isExisting: boolean;
}

export interface ExistingPhoto {
  id?: number;
  originalFileName?: string;
  extension?: string;
  originalImage?: string;
  thumbnailImage?: string;
}

@Component({
  selector: 'eco-file-upload',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnDestroy, OnInit {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  filesChanged = output<File[]>();
  deleteExistingPhoto = output<{ id: number; onSuccess: () => void; onError: () => void }>();

  control = input<FormControl>();
  title = input<string>('Title');
  subtitle = input<string>('Subtitle');
  hideSbtitle = input<boolean>(false);
  maxFileSize = input<number>(30);

  files: File[] = [];
  previews: FilePreview[] = [];
  isDragOver = false;

  private readonly allowedTypes = ['image/jpeg', 'image/png'];

  private get maxSizeBytes(): number {
    return this.maxFileSize() * 1024 * 1024;
  }

  ngOnInit() {
    const value = this.control()?.value ?? [];

    value.forEach((item: ExistingPhoto) => {
      this.previews.push({
        name: item.originalFileName ?? '',
        url: `data:image/${item.extension?.replace('.', '')};base64,${item.thumbnailImage}`,
        id: item.id,
        isExisting: true,
      });
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.addFiles(droppedFiles);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  removeFile(index: number) {
    const preview = this.previews[index];

    if (preview.isExisting) {
      this.deleteExistingPhoto.emit({
        id: preview.id as number,
        onSuccess: () => {
          this.previews.splice(index, 1);
          this.control()?.setValue(this.files);
          this.filesChanged.emit(this.files);
        },
        onError: () => {
          // Component will deal with error
        },
      });
      return;
    }

    URL.revokeObjectURL(preview.url);
    this.files = this.files.filter(f => f !== preview.file);
    this.previews.splice(index, 1);
    this.control()?.setValue(this.files);
    this.filesChanged.emit(this.files);
  }
  ngOnDestroy() {
    this.previews.forEach(p => URL.revokeObjectURL(p.url));
  }

  private addFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!this.allowedTypes.includes(file.type)) continue;
      if (file.size > this.maxSizeBytes) continue;

      /**
       * TODO: Error message
       */

      this.files.push(file);
      this.previews.push({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
        isExisting: false,
      });
    }

    this.control()?.setValue(this.files);

    this.filesChanged.emit(this.files);
  }

  public removeAllPreviews(): void {
    this.previews.forEach(p => {
      if (!p.isExisting) {
        URL.revokeObjectURL(p.url);
      }
    });
    this.previews = [];
    this.files = [];
    this.control()?.setValue([]);

    console.log(this.previews);
  }
}
