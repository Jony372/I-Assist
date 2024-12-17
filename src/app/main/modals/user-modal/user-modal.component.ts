import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalInterface } from 'flowbite';
import { usuario } from '../../../services/usuario/usuario.interface';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { TOAST } from '../../../../assets/consts';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent {
  @Input() modal!: ModalInterface;
  @Output() actualizar = new EventEmitter<null>;
  user!: usuario;
  private selectedFile!: File;
  

  updateForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    birthdate: ["", [Validators.required]],
    email: ["", [Validators.required]],
    phone: ["", [Validators.required]],
    password: ['', [Validators.required]],
    new_password: ['', [Validators.required]]
  })

  constructor(private formBuilder:FormBuilder, private userService:UsuarioService,
    private userAuthService: UserAuthService
  ){}

  ngOnInit(){
    this.userAuthService.getUser()?.subscribe({
      next: (user) => this.user = user as usuario,
      error: (error) => alert('Error loading user'),
      complete: () => {
        this.updateForm.patchValue({
          name: this.user.name,
          last_name: this.user.last_name,
          birthdate: this.user.birthdate,
          email: this.user.email,
          phone: this.user.phone
        })
      }
      });
  }

  onFileSelected(event: any){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  updateUser(){
    this.userService.updateUser(this.user._id, this.updateForm.value as usuario,
      this.selectedFile
    ).subscribe({
      next: user => {
        this.modal.hide();
        TOAST.fire({
          icon: 'success',
          title: `Usuario ${user.name} actualizado correctamente`
        })
      },
      error: error => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al actualizar usuario:\n'+error.error.message
        })
        console.log("Error: ", error);
      },
      complete: () => {
        this.ngOnInit();
        this.actualizar.emit();
      }
    })
  }
}
