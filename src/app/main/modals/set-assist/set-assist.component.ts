import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-set-assist',
  standalone: true,
  imports: [],
  templateUrl: './set-assist.component.html',
  styleUrl: './set-assist.component.css'
})
export class SetAssistComponent {
  @Input() modal!: ModalInterface;
  @Output() setAttendance = new EventEmitter<number>(); 

  set(att: number){
    this.setAttendance.emit(att);
    this.modal.hide();
  }

}
