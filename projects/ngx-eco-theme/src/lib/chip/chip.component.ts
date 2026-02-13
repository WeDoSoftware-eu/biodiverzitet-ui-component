import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { EcoIcon, IconComponent } from '../icon/icon.component';

export type ChipStatus =
  | 'active'
  | 'inactive'
  | 'completed'
  | 'in-progress'
  | 'new'
  | 'closed'
  | 'sanitary'
  | 'unsanitary';

@Component({
  selector: 'eco-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, IconComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  icon = input<EcoIcon>();
  status = input.required<ChipStatus>();
}
