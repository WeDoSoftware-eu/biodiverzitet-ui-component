import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'eco-measure-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './measure-button.component.html',
  styleUrls: ['./measure-button.component.scss'],
})
export class MeasureButtonComponent {
  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
