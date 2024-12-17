import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalInterface } from 'flowbite';
import { Notification } from '../../../services/usuario/usuario.interface';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [],
  templateUrl: './notifications-modal.component.html',
  styleUrl: './notifications-modal.component.css'
})
export class NotificationsModalComponent {
  @Input() notifications!: Array<Notification>;
  @Input() modal!: ModalInterface;
  @Output() readNotification = new EventEmitter<string>;

  notificationSelected: Notification = {message: ''} as Notification;

  colorNotification(isRead: boolean): string {
    return isRead ? 'bg-white' : 'bg-secondary';
  }

  read(id: string): void {
    this.readNotification.emit(id);
  }
}