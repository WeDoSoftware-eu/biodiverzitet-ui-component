import { InjectionToken } from '@angular/core';
import { ModalMode } from './modal.component';

export const MODAL_MODE = new InjectionToken<ModalMode>('MODAL_MODE');
export const MODAL_DATA = new InjectionToken<unknown>('MODAL_DATA');
