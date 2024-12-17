import { Injectable } from '@angular/core';
import { usuario } from './usuario/usuario.interface';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from './usuario/usuario.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
    private cookieService: CookieService,
    private usuarioService: UsuarioService
  ){ }

  setUser(usuario: usuario, remember: boolean){
    try{
      const time = remember?30:0
      this.cookieService.set('user', usuario._id, time, '/');
      this.cookieService.set('is_teacher', usuario.is_teacher.toString(), time, '/');
    }catch(error){
      console.log("Error: ", error);
    }
  }
  verifyUser():boolean{
    return this.cookieService.check('user');
  }
  deleteUser(){
    this.cookieService.delete('user', '/');
  } 

  getUser():Observable<usuario> | null{
    //Obtener el usuario
    if (this.verifyUser()) {
      const id = this.cookieService.get('user');
      return this.usuarioService.getUser(id);
    }else{
      return null;
    }
  }

  getUserId():string{
    return this.cookieService.get('user');
  }

  getIsTeacher():boolean{
    return this.cookieService.get('is_teacher') === 'true';
  }

  updateUser(){
    this.getUser()?.subscribe({
      next: user => {
        this.usuarioService.getUser(user._id).subscribe({
          next: user => {
            // this.setUser(user);
          },
          error: error => {
            console.log("Error: ", error);
          }
        });
      },
      error: error => {
        console.log("Error: ", error);
      }
    });
  }
}