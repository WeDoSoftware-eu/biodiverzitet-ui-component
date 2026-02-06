import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoverTooltipData } from './hover-tooltip.model';

@Component({
  selector: 'eco-hover-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hover-tooltip.component.html',
  styleUrls: ['./hover-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverTooltipComponent {
  data = input<HoverTooltipData | null>(null);
}
