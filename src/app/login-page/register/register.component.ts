import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { usuario } from '../../services/usuario/usuario.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() onSwitchMode = new EventEmitter<null>;
  @Output() register = new EventEmitter<usuario>;
  
  constructor(private formBuilder:FormBuilder) {}

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    birthdate: ['', [Validators.required]],
    email: ['', [Validators.required]],
    control_number: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]],
    is_teacher: [false]
  });


  switchMode() {
    this.onSwitchMode.emit();
  }

  onRegister() {
    if (this.registerForm.valid) {
      const data:usuario = this.registerForm.value as usuario;
      // console.log(data);
      this.register.emit(data);
    }
  }
}
