import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-layers-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layers-button.component.html',
  styleUrls: ['./layers-button.component.scss'],
})
export class LayersButtonComponent {
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
