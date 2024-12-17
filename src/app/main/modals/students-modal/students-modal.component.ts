import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Modal, ModalInterface } from 'flowbite';
import { TOAST } from '../../../../assets/consts';
import { ClassService } from '../../../services/class/class.service';
import { usuario } from '../../../services/usuario/usuario.interface';
import { ConfirmModal2Component } from '../confirm-modal2/confirm-modal2.component';

@Component({
  selector: 'app-students-modal',
  standalone: true,
  imports: [ConfirmModal2Component],
  templateUrl: './students-modal.component.html',
  styleUrl: './students-modal.component.css'
})
export class StudentsModalComponent {
  @Input() students!: Array<usuario>;
  @Input() clase!: string;
  @Input() clase_id!: string;
  @Input() modal!: ModalInterface;
  @Output() finish = new EventEmitter<null>;
  confirmModal!: ModalInterface;
  student: usuario = {name: ''} as usuario

  constructor(private classService: ClassService) { }

  ngAfterViewInit(): void {
    this.confirmModal = new Modal(document.getElementById('confirm-modal2'))
  }

  closeModal(){
    this.modal?.hide();
  }

  unsubscribe(){
    this.classService.unsubscribeStudent(this.clase_id, this.student._id).subscribe({
      next: (data) => {
        TOAST.fire({
          icon: 'success',
          title: data.message
        });
      },
      error: (err) => {
        TOAST.fire({
          icon: 'error',
          title: err.error.message
        });
      },
      complete: () => {
        this.modal.hide();
        this.finish.emit();
      }
    });
  }

  setStudent(student: usuario){
    this.modal.hide()
    this.student = student
    this.confirmModal.show()
  }
}
