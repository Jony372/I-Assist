import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TOAST } from '../../../assets/consts';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() onSwitchMode = new EventEmitter<null>;
  @Output() login = new EventEmitter<[string, string, boolean]>;

  constructor(private formBuilder: FormBuilder){}
  
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]
  })

  ngOnInit(): void {
    this.loginForm.patchValue({
      email: null,
      password: null
    });
  }
  
  switchMode() {
    this.onSwitchMode.emit();
  }

  onLogin(){
    const form = this.loginForm;
    if(form.valid){
      const form = [this.loginForm.get('email')?.value as string,
        this.loginForm.get('password')?.value as string,
        this.loginForm.get('remember')?.value as boolean];
      this.login.emit(form as [string, string, boolean]);
    }else{
      if(!form.value.email || !form.value.password){
        TOAST.fire({
          icon: 'warning',
          title: 'Error: Llene los datos, por favor',
          });
      }else if(form.get('email')?.invalid){
        TOAST.fire({
          icon: 'error',
          title: 'Error: Escriba un correo valido',
          });
      }
    }
  }
}