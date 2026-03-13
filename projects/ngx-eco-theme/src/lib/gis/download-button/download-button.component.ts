import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'eco-download-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './download-button.component.html',
  styleUrls: ['./download-button.component.scss'],
})
export class DownloadButtonComponent {
  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
