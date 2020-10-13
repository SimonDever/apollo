import { animate, style, transition } from '@angular/animations';
import { trigger } from "@angular/animations";

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('.2s ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('.2s ease-in', style({ opacity: 0 }))
  ])
]);
