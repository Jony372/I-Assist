import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { usuario } from '../usuario/usuario.interface';
import { API_URL } from '../../../assets/consts';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  login(email: string, password: string):Observable<usuario>{
    return this.http.post<usuario>(
      `${API_URL}/login`, {email: email, password: password}
    ).pipe(catchError(error => {
      throw error;
    }));
  }

  register(user: usuario):Observable<usuario>{
    return this.http.post<usuario>(
      `${API_URL}/users`, user
    ).pipe(catchError(error => {
      throw error;
    }));
  }
}
