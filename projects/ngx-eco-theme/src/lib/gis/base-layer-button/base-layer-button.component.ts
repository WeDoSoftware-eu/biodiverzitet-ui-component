import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-base-layer-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-layer-button.component.html',
  styleUrls: ['./base-layer-button.component.scss'],
})
export class BaseLayerButtonComponent {
  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
