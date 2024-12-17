import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginService } from '../services/login/login.service';
import { usuario } from '../services/usuario/usuario.interface';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { TOAST } from '../../assets/consts';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  isLogin = true;

  constructor(private loginService:LoginService, private userAuthService:
    UserAuthService, private router: Router){}

  ngOnInit(){
    if(this.userAuthService.verifyUser()){
      this.router.navigate(['/inicio']);
    }
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  action(dates: usuario | any){
    try{
      if (this.isLogin) {
        const [email, password, remember] = dates as [string, string, boolean];
        this.loginService.login(email, password).subscribe({
          next: (user) => {
            this.userAuthService.setUser(user, remember);
            TOAST.fire({
              icon: 'success',
              title: 'Bienvenido ' + user.name,
            })
            this.router.navigate(['/inicio']);
            // window.location.href = '/inicio';
          },
          error: (error) => {
            TOAST.fire({
              icon: 'error',
              title: 'Error: ' + error.error.message,
            })
          }
        })
      }else{
        const user: usuario = dates as usuario;
        this.loginService.register(user).subscribe({
          next: (response) => {
            TOAST.fire({
              icon: 'success',
              title: 'Usuario registrado correctamente\nBienvenido '
              + response.name,
            })
            this.userAuthService.setUser(response, false);
            this.router.navigate(['/inicio']);
          },
          error: (error) => {
            TOAST.fire({
              icon:  error.status === 400 ? "warning" : "error",
              title: 'Error: ' + error.error.message,
            })
            console.log(error);
          }
        })
      }
    }catch(e){
      TOAST.fire({
        icon: 'error',
        title: 'Ocurrio un error: ' + e,
      })
      console.error(e);
    }
  }

}