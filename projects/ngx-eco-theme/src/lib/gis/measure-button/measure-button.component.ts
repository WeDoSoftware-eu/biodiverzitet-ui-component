import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-measure-button',
  standalone: true,
  imports: [CommonModule],
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
