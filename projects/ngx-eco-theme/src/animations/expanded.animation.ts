import { animate, state, style, transition, trigger } from '@angular/animations';

export const expanded = trigger('expanded', [
  state('*', style({ height: '*', opacity: 1, overflow: 'hidden' })),
  state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
  transition('* <=> collapsed', animate('225ms ease-in-out')),
]);
