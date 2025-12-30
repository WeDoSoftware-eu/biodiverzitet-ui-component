import {
  Component,
  inject,
  Injector,
  Type,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MODAL_DATA, MODAL_MODE } from './modal.token';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

export type ModalMode = 'add' | 'edit' | 'view';

export interface ModalData<T extends ModalFormComponent> {
  title: string;
  subtitle: string;
  component: Type<T>;
  mode: ModalMode;
  payload?: unknown;
  data: T;
}

export interface ModalFormComponent {
  formGroup: FormGroup;
  onSubmit(): unknown;
}

@Component({
  selector: 'eco-modal',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, IconComponent, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;
  readonly data = inject<ModalData<ModalFormComponent>>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ModalComponent>);

  formInstance?: ModalFormComponent;

  componentInjector = Injector.create({
    providers: [
      { provide: MODAL_MODE, useValue: this.data.mode },
      { provide: MODAL_DATA, useValue: this.data.data },
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
