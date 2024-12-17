import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-confirm-modal2',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal2.component.html',
  styleUrl: './confirm-modal2.component.css'
})
export class ConfirmModal2Component {
  @Input() modal!: ModalInterface;
  @Input() title: string = "";
  @Output() confirm = new EventEmitter<any>;

  confirmar(){
    this.confirm.emit();
    this.modal.hide();
  }
}
