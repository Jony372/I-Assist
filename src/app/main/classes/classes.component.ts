import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modal, ModalInterface } from 'flowbite';
import { TOAST } from '../../../assets/consts';
import { claseInterface } from '../../services/class/class.interface';
import { ClassService } from '../../services/class/class.service';
import { UserAuthService } from '../../services/user-auth.service';
import { usuario } from '../../services/usuario/usuario.interface';
import { ClassModalComponent } from '../modals/class-modal/class-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { QrAssistReaderComponent } from "../modals/qr-assist-reader/qr-assist-reader.component";
import { QrGeneratorModalComponent } from '../modals/qr-generator-modal/qr-generator-modal.component';
import { QrReaderModalComponent } from '../modals/qr-reader-modal/qr-reader-modal.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [ClassModalComponent, RouterLink, QrReaderModalComponent,
    QrGeneratorModalComponent, QrAssistReaderComponent, ConfirmModalComponent],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent {
  modal!: ModalInterface;
  QRmodal!: ModalInterface;
  qrReaderModal!: ModalInterface;
  confirmModal!: ModalInterface;
  classes !: Array<claseInterface>;
  classToDelete =  {id: "", name: ""};
  isEdit: Boolean = false;
  classToEdit!: {id: string, name: string, semester_id: string};
  private user : usuario = {} as usuario;
  private code!: string;
  private classId!: string;

  constructor(private userAuthService: UserAuthService,
    private classService: ClassService
  ) {}
  
  isTeacher(){
    return this.userAuthService.getIsTeacher();
  }

  ngOnInit(){
    this.userAuthService.getUser()?.subscribe({
      next: (user) => {
        this.user = user as usuario
        this.classes = this.user.classes
      },
      error: (error) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al cargar las clases: ' + error.error.message
        });
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.isTeacher()) {
      this.modal = new Modal(document.getElementById('class-modal'));
      this.QRmodal = new Modal(document.getElementById('qr-generator-modal'));
      this.confirmModal = new Modal(document.getElementById('confirm-modal'));
    }else{
      this.qrReaderModal = new Modal(document.getElementById('qr-add-assist-modal'));
      this.modal = new Modal(document.getElementById('qr-add-class-modal'));
    }
  }

  selectDeleteClass(id: string, name: string){
    this.classToDelete = {
      id: id,
      name: name
    };
    this.confirmModal.show();
  }
  
  addClass(){
    this.isEdit = false;
    this.modal.show();
  }

  editClass(clase: claseInterface){
    this.isEdit = true;
    this.classToEdit = {
      id: clase._id,
      name: clase.name,
      semester_id: clase.semester._id
    };
    this.modal.show();
  }

  deleteClass(){
    this.classService.deleteClass(this.classToDelete.id).subscribe({
      error: error => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al eliminar la clase: ' + error.error.message
        });
      },
      complete: () => {
        this.ngOnInit()
        TOAST.fire({
          icon: 'success',
          title: `Clase ${this.classToDelete.name} eliminada`
        });
        this.confirmModal.hide();
      }
    });
  }

  selectQR(code: string, classId: string){
    if(this.user.is_teacher){
      this.code = code;
      this.QRmodal.show()
    }else{
      this.classId = classId;
      this.qrReaderModal.show()
    }
  }

  getCode():string{
    return this.code;
  }

  readQR(code: string){
    this.classService.addStudent(code, this.user._id).subscribe({
      error: error => {
        alert(error.error.message)
        console.log(error.error.message)
      },
      complete: () => window.location.reload()
    });
  }

  getAssist(code: string){
    this.classService.getAssist(code, this.user._id, this.classId).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (error) => {
        alert(error.error.message);
      },
      complete: () => {
        window.location.reload();
      }
    })
  }
}