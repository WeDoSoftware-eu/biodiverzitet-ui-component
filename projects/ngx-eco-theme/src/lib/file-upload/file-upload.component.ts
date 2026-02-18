import { Component, input, output, OnDestroy, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';

interface FilePreview {
  file: File;
  name: string;
  url: string;
}

@Component({
  selector: 'eco-file-upload',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnDestroy {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  filesChanged = output<File[]>();

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
    URL.revokeObjectURL(this.previews[index].url);
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
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
      });
    }
    this.filesChanged.emit(this.files);
  }
}
