import { animate, state, style, transition, trigger } from '@angular/animations';

export const indicatorRotate = trigger('indicatorRotate', [
  state('*', style({ transform: 'rotate(180deg)' })),
  transition('* <=> *', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
]);
