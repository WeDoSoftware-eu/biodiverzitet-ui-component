import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-location-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-button.component.html',
  styleUrls: ['./location-button.component.scss'],
})
export class LocationButtonComponent {
  isActive = input<boolean>(false);
  buttonClick = output<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
