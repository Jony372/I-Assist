import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../../../services/class/class.service';
import { claseInterface } from '../../../services/class/class.interface';
import { attendanceInterface }
  from '../../../services/attendance/attendance.interface';
import { AttendanceService }
  from '../../../services/attendance/attendance.service';
import { usuario } from '../../../services/usuario/usuario.interface';
import { UserAuthService } from '../../../services/user-auth.service';
import { QrGeneratorModalComponent }
  from '../../modals/qr-generator-modal/qr-generator-modal.component';
import { Modal, ModalInterface } from 'flowbite';
import { WebSocketService }
  from '../../../services/webSocket/web-socket.service';
import { ConfirmModalComponent }
  from '../../modals/confirm-modal/confirm-modal.component';
import { TOAST } from '../../../../assets/consts';
import { StudentsModalComponent }
  from '../../modals/students-modal/students-modal.component';
import * as XLSX from 'xlsx';
import { SetAssistComponent } from '../../modals/set-assist/set-assist.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listas',
  standalone: true,
  imports: [QrGeneratorModalComponent, ConfirmModalComponent,
    StudentsModalComponent, SetAssistComponent, FormsModule],
  templateUrl: './listas.component.html',
  styleUrl: './listas.component.css'
})
export class ListasComponent {
  private intervalId!: any;
  clase: claseInterface = {} as claseInterface
  attendances!: Array<attendanceInterface>
  students!: Array<usuario>
  user!: usuario
  QRmodal!: ModalInterface
  confirmModal!: ModalInterface
  toAttendance: {id: string, date: string} = {id: '', date: ''}
  studentsModal!: ModalInterface
  attendanceModal!: ModalInterface
  att!: string 
  attId!: string
  filterDate: [string, string] = ["", ""]
  private classId!: string

  constructor(private route: ActivatedRoute, private classService: ClassService,
    private router: Router, private attendanceService: AttendanceService,
    private userAuthService: UserAuthService, private wsService: WebSocketService) { }

  ngOnInit(): void {
    this.userAuthService.getUser()?.subscribe({
      next: (user) => this.user = user as usuario,
      error: (error) => {
        TOAST.fire({
          title: 'Error al obtener usuario: '+error.error.message,
          icon: 'error'
        });
      }
      });

    this.classId = this.route.snapshot.params['id'];
    this.getClass(this.classId);
    this.initAttendance();
  }

  initAttendance(): void {
    this.attendanceService.getAttendances(this.classId).subscribe({
      next: (data) => {
        const len = data.length
        this.attendances = data;
        this.filterDate = [
          data[0].day,
          data[len - 1].day
        ]
      },
      error: (err) => {
        TOAST.fire({
          title: 'No se encontro la clase',
          icon: 'error'
        });
        console.warn(err);
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.isTeacher()) {
      this.QRmodal = new Modal(document.getElementById('qr-generator-modal'));
      this.confirmModal = new Modal(document.getElementById('confirm-modal'));
      this.studentsModal = new Modal(document.getElementById('students-modal'));
      this.attendanceModal = new Modal(document.getElementById('set-attendance-modal'));
    }
  }

  isTeacher(): boolean {
    return this.userAuthService.getIsTeacher();
  }

  getClass(id:string){
    this.classService.getClass(id).subscribe({
        next: (data) => {
          this.clase = data;
          this.students = data.students.sort(
            (a, b) => a.last_name.localeCompare(b.last_name)
          );
        },
        error: (err) => {
          TOAST.fire({
            title: "No se encontro la clase",
            icon: 'error'
          });
          console.warn("Error", err);
          this.router.navigate(['/inicio/classes']);
        }
      })
  }

  getDays(): Array<string> {
    return this.clase.schedules.map(schedule => schedule.day);
  }

  bgColor(n: number):string{
    if(n == 1) return 'bg-delete-color';
    if(n == 2) return 'bg-edit-color';
    return 'bg-view-color';
  }

  getAttendances(student:string):Array<any>{
    const attendances = this.attendances
      ?.flatMap(att => att.attendance) // Aplanar todos los elementos de `attendance` en una sola lista
      .filter(att => att.student?._id === student) // Filtrar por `student._id`
      .map(att => att);
    if(attendances){
      return attendances
    }
    return [];
  }

  selectAttendance(attendance_id: string, date: string){
    this.toAttendance = {
      id: attendance_id,
      date: date
    };
    this.confirmModal.show();
  }

  setAllAssist(){
    this.classService.setAllAttendance(this.toAttendance.id).subscribe({
      next: (data) => {
        TOAST.fire({
          title: data.message,
          icon: 'success'
        })
      },
      error: (err) => {
        TOAST.fire({
          title: 'Error al actualizar asistencia: '+err.error.message,
          icon: 'error'
        })
      },
      complete: () => {
        this.filter();
      }
    })
  }
  
  exportTable(){
    const filename = this.clase.name + ' - ' + new Date()
      .toLocaleDateString() + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById('attendance-table')
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.clase.name);

    XLSX.writeFile(wb, filename);
  }

  select(day: number, att: string){
    this.att = this.attendances[day]._id;
    this.attId = att
    // alert(this.day)
    this.attendanceModal.show();

  }

  setAttendance(value: number){
    this.attendanceService.setAttendance(this.att, value, this.attId).subscribe({
      next: (data) => {
        TOAST.fire({
          title: data.message,
          icon: 'success'
        });
      },
      error: (err) => {
        TOAST.fire({
          title: 'Error al actualizar asistencia: '+err.error.message,
          icon: 'error'
        });
      },
      complete: () => {
        this.filter();
      }
    });
  }

  filter(){
    this.attendanceService.getFilterAttendances(
      this.clase._id,
      this.filterDate[0],
      this.filterDate[1]
    ).subscribe({
      next: (data) => {
        this.attendances = data;
      },
      error: (err) => {
        TOAST.fire({
          title: 'Error al filtrar asistencias: '+err.error.message,
          icon: 'error'
        });
      }
    });
  }

}
