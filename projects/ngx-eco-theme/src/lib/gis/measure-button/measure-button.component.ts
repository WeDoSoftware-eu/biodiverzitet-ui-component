import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-measure-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './measure-button.component.html',
  styleUrls: ['./measure-button.component.scss'],
})
export class MeasureButtonComponent {
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
