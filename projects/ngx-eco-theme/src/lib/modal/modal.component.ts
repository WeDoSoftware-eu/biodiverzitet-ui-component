import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { ChipComponent, ChipStatus } from '../chip/chip.component';
import { DEFAULT_ECO_THEME_I18N, ECO_THEME_I18N } from '../eco-theme-I18n';
import { EcoIcon, IconComponent } from '../icon/icon.component';
import { MODAL_DATA, MODAL_MODE, MODAL_STORE } from './modal.token';

export type ModalMode = 'add' | 'edit' | 'view';

export interface ModalData<T extends ModalFormComponent> {
  title: Observable<string>;
  subtitle: Observable<string>;
  component: Type<T>;
  mode: ModalMode;
  payload?: unknown;
  data: T;
  chipHeader?: ChipHeader[];
  store: unknown;
}

export interface ModalFormComponent {
  formGroup: FormGroup;
  onSubmit(): unknown;
}

export interface ChipHeader {
  status: ChipStatus;
  text: Observable<string>;
  icon: EcoIcon;
}

@Component({
  selector: 'eco-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    IconComponent,
    ButtonComponent,
    ChipComponent,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements AfterViewInit {
  i18n = inject(ECO_THEME_I18N, { optional: true }) ?? DEFAULT_ECO_THEME_I18N;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;
  readonly data = inject<ModalData<ModalFormComponent>>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ModalComponent>);

  formInstance?: ModalFormComponent;

  componentInjector = Injector.create({
    providers: [
      { provide: MODAL_MODE, useValue: this.data.mode },
      { provide: MODAL_DATA, useValue: this.data.data },
      { provide: MODAL_STORE, useValue: this.data.store },
    ],
    parent: inject(Injector),
  });

  ngAfterViewInit() {
    const componentRef = this.container.createComponent(this.data.component, {
      injector: this.componentInjector,
    });

    this.formInstance = componentRef.instance as ModalFormComponent;
  }

  onComponentActivated(componentRef: unknown) {
    this.formInstance = componentRef as ModalFormComponent;
  }

  async save() {
    if (this.formInstance && this.formInstance.formGroup.valid) {
      const formData = await this.formInstance.onSubmit();
      this.dialogRef.close(formData);
    } else if (this.formInstance?.formGroup) {
      this.formInstance?.formGroup.markAllAsTouched();
    }
  }
}
