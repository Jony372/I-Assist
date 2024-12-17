import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../../../assets/consts';
import { semester } from './semester.interface';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(private httpClient: HttpClient) { }

  getSemesters():Observable<Array<semester>>{
    return this.httpClient.get<Array<semester>>(
      `${API_URL}/semesters/`
    ).pipe(catchError(err=>{throw err}));
  }

  getSemester(id:string):Observable<semester>{
    return this.httpClient.get<semester>(
      `${API_URL}/semesters/${id}`
    ).pipe(catchError(err=>{throw err}));
  }
}
