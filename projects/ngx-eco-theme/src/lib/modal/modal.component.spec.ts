import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent, ModalData, ModalFormComponent } from './modal.component';

@Component({
  selector: 'eco-test-component',
  standalone: true,
  template: '<div>test component</div>',
})
export class TestComponent implements ModalFormComponent {
  formGroup: FormGroup = jasmine.createSpyObj('data', ['formGroup', 'onSubmit']);
  onSubmit(): unknown {
    throw new Error('Method not implemented.');
  }
}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let data: ModalData<ModalFormComponent>;

  beforeEach(async () => {
    data = {
      title: '',
      subtitle: '',
      store: {},
      mode: 'view',
      data: jasmine.createSpyObj('data', ['formGroup', 'onSubmit']),
      component: TestComponent,
    };

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        {
          provide: MatDialogRef<ModalComponent>,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
