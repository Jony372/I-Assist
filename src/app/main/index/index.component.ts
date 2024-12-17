import { Component } from '@angular/core';
import { AttendancesComponent } from '../charts/attendances/attendances.component';
import { UserAuthService } from '../../services/user-auth.service';
import { AttendancesPorcentComponent } 
  from '../charts/attendances-porcent/attendances-porcent.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [AttendancesComponent, AttendancesPorcentComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  clases: boolean = false;

  constructor(private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.userAuthService.getUser()?.subscribe({
      next: (user) => {
        if (user.classes.length > 0) {
          this.clases = true;
        }
      }
    })
  }

  isTeacher: boolean = this.userAuthService.getIsTeacher();

}