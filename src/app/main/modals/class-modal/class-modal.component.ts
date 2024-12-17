import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators
} from '@angular/forms';
import { ModalInterface } from 'flowbite';
import { TOAST } from '../../../../assets/consts';
import { claseData, scheduleInterface }
  from '../../../services/class/class.interface';
import { ClassService } from '../../../services/class/class.service';
import { semester } from '../../../services/semester/semester.interface';
import { SemesterService } from '../../../services/semester/semester.service';
import { UserAuthService } from '../../../services/user-auth.service';

@Component({
  selector: 'app-class-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './class-modal.component.html',
  styleUrl: './class-modal.component.css'
})
export class ClassModalComponent {
  @Input() modal!: ModalInterface;
  @Input() isEdit: Boolean = false;
  // @Input() classId!: string; 
  @Input() classData!: {id: string, name: string, semester_id: string};
  @Output() update = new EventEmitter<null>;
  semesters!: Array<semester>;
  classForm!: FormGroup;
  editClassForm!: FormGroup;
  
  constructor(
    private semesterService: SemesterService,
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private classService: ClassService
  ) {
    this.classForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      semester_id: ['', Validators.required],
      schedules: this.formBuilder.array([this.createScheduleGroup()])
    })
    this.editClassForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      semester_id: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['classData']) {
      this.editClassForm.patchValue({
        name: this.classData.name,
        semester_id: this.classData.semester_id
      });
    }
  }

  createScheduleGroup(): FormGroup {
    return this.formBuilder.group({
      day: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.semesterService.getSemesters().subscribe({
      next: (semesters) => {
        this.semesters = semesters;
      },
      error: error => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al cargar las clases: ' + error.error.message
        })
      }
    });
  }

  crearClase(){
    if (this.isEdit) {
      if (this.editClassForm.valid) {
        const values = this.editClassForm.value;
        if (values.name === this.classData.name
            &&
            values.semester_id === this.classData.semester_id) {
          TOAST.fire({
            icon: 'warning',
            title: 'Por favor, cambie al menos un campo'
          });
          return;
        }
        this.classService.updateClass(
          this.classData.id,
          this.editClassForm.value.name,
          this.editClassForm.value.semester_id
        ).subscribe({
          next: (data) => {
            this.modal.hide();
            this.update.emit();
            TOAST.fire({
              icon: 'success',
              title: data.message
            });
          },
          error: error => {
            TOAST.fire({
              icon: 'error',
              title: 'Error al editar la clase: ' + error.error.message
            })
          },
          complete: () => {
            this.editClassForm.reset()
          }
        });
        
      }
    }else{
      if (this.classForm.valid) {
        this.userAuthService.getUser()?.subscribe({
          next: (user) => {
            const classData = {
              name: this.classForm.value.name as string,
              semester_id: this.classForm.value.semester_id as string,
              teacher_id: user._id,
              schedules: this.classForm.value.schedules as Array<scheduleInterface>,
            } as claseData;
            
            this.classService.createClass(classData).subscribe({
              next: () => {
                this.modal.hide();
                this.update.emit();
              },
              error: error => {
                TOAST.fire({
                  icon: 'error',
                  title: 'Error al crear la clase: ' + error.error.message
                })
              },
              complete: () => this.classForm.reset()
            });
          },
          error: error => {
            TOAST.fire({
              icon: 'error',
              title: 'Error al obtener el usuario: ' + error.error.message
            })
          }
        });
      }else{
        TOAST.fire({
          icon: 'warning',
          title: 'Por favor, complete los campos requeridos'
        });
      }
    }
  }

  get schedules(): FormArray {
    return this.classForm.get('schedules') as FormArray;
  }

  addSchedule(){
    this.schedules.push(this.createScheduleGroup());
  }

  removeSchedule(index: number){
    this.schedules.removeAt(index);
  }

}
