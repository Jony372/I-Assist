import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { usuario } from './usuario.interface';
import { API_URL } from '../../../assets/consts';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient:HttpClient) { }

  getUser(id:string):Observable<usuario>{
    return this.httpClient.get<usuario>(
      `${API_URL}/users/${id}`
    ).pipe(catchError(err=>{throw err}));
  }

  updateUser(id:string, user:usuario, profilePicture: File):Observable<usuario>{
    const formData = new FormData();
    formData.append('file', profilePicture);
    formData.append('name', user.name);
    formData.append('last_name', user.last_name);
    formData.append('birthdate', user.birthdate);
    formData.append('email', user.email);
    formData.append('phone', user.phone);

    return this.httpClient.post<usuario>(
      `${API_URL}/users/update/${id}`, formData
    ).pipe(catchError(err=>{throw err}));
  }

  deleteUser(id:string):Observable<any>{
    return this.httpClient.post(
      `${API_URL}/users/delete/${id}`, null
    ).pipe(catchError(err=>{throw err}));
  }

  readNotification(id:string, notificationId:string):Observable<any>{
    return this.httpClient.post(
      `${API_URL}/users/notification-read/${notificationId}`, {
      user_id: id
    }).pipe(catchError(err=>{throw err}));
  }

  getNotifications(id:string):Observable<any>{
    return this.httpClient.get(
      `${API_URL}/users/notifications/${id}`
    ).pipe(catchError(err=>{throw err}));
  }
}
