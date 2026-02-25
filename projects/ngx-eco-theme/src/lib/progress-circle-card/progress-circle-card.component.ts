import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'eco-progress-circle-card',
  standalone: true,
  templateUrl: './progress-circle-card.component.html',
  styleUrl: './progress-circle-card.component.scss',
})
export class ProgressCircleCardComponent {
  label = input.required<string>();
  percentage = input<number>(0);

  private readonly circumference = 2 * Math.PI * 40;

  dashoffset = computed(() => this.circumference * (1 - this.percentage() / 100));
}
