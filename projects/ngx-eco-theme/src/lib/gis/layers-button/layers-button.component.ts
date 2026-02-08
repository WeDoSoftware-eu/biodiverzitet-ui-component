import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-layers-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layers-button.component.html',
  styleUrl: './layers-button.component.scss',
})
export class LayersButtonComponent {
  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
