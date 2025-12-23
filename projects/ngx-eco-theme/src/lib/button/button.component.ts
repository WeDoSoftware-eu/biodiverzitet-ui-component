import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EcoIcon, IconComponent } from '../icon/icon.component';

@Component({
  selector: 'eco-button',
  standalone: true,
  imports: [MatButtonModule, CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  icon = input<EcoIcon>();
  buttonClass = input<'primary' | 'secondary' | 'tertiary'>('primary');
}
