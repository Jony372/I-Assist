import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() modal!: ModalInterface;
  @Input() title: string = "";
  @Output() confirm = new EventEmitter<any>;

  confirmar(){
    this.confirm.emit();
    this.modal.hide();
  }
}
