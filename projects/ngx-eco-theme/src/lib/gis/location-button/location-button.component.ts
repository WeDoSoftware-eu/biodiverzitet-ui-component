import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'eco-location-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
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
