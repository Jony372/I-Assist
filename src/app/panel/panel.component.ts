import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Modal, ModalInterface } from 'flowbite';
import { UserModalComponent } from '../main/modals/user-modal/user-modal.component';
import { ClassService } from '../services/class/class.service';
import { UserAuthService } from '../services/user-auth.service';
import { Notification, usuario } from '../services/usuario/usuario.interface';
import { API_URL, TOAST } from '../../assets/consts';
import { NotificationsModalComponent }
  from '../main/modals/notifications-modal/notifications-modal.component';
import { UsuarioService } from '../services/usuario/usuario.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [UserModalComponent, RouterLink, NotificationsModalComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  userModal!: ModalInterface;
  usuario!: usuario;
  notifications: Array<Notification> = [];
  notificationModal!: ModalInterface;
  wrNotification: number = 0;

  ngAfterViewInit(): void {
    this.notificationModal = new Modal(
      document.getElementById('notifications-modal') as HTMLElement);
  }

  ruta(): string{
    return API_URL + this.usuario?.profile_picture
  }

  constructor(private userAuthService: UserAuthService, private router: Router,
    private classService: ClassService, private userService: UsuarioService) { }

  notificationWithoutRead() {
    this.wrNotification = this.notifications.filter
      ((notification) => !notification.is_read).length;
  }
  
  ngOnInit(){
    const element = document.getElementById('user-modal') as HTMLElement;
    this.userModal = new Modal(element);
    timer(30000, 30000).subscribe(() => {
      this.loadNotifications();
    });
    this.userAuthService.getUser()?.subscribe({
      next: (user) => {
        this.usuario = user as usuario;
        this.notifications = user.notifications;
      },
      error: (error) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al cargar el usuario: ' + error.error.message
        });
      },
      complete: () => {
        this.notificationWithoutRead();
      }
    });
  }

  loadNotifications() {
    this.userService.getNotifications(this.usuario._id).subscribe({
      next: (nn) => {
        this.notifications = nn;
      },
      error: (error) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al cargar las notificaciones: ' + error.error.message
        });
      },
      complete: () => {
        this.notificationWithoutRead();
      }
    });
  }

  logout(){
    this.userAuthService.deleteUser();
    this.router.navigate(['/login']);
  }

  readNotification(id: string): void {
    this.userService.readNotification(this.usuario._id, id).subscribe({
      next: (nn) => {
        this.notifications = nn;
      },
      error: (error) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al leer la notificación: ' + error.error.message
        });
      },
      complete: () => {
        this.notificationWithoutRead();
        console.log(this.wrNotification);
      }
    });
  }
}