import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../assets/consts';
import { attendanceInterface } from './attendance.interface';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private httpClient: HttpClient) { }

  getAttendances(classId: string):Observable<Array<attendanceInterface>> {
    return this.httpClient.get<Array<attendanceInterface>>(
      `${API_URL}/attendance/${classId}`
    ).pipe(catchError(err=>{throw err}));
  }

  getFilterAttendances(classId: string, start: string, end: string):Observable<Array<attendanceInterface>> {
    return this.httpClient.get<Array<attendanceInterface>>(
      `${API_URL}/attendance/${classId}/${start}/${end}`
    ).pipe(catchError(err=>{throw err}));
  }

  setAttendance(id: string, att: number, attId: string):Observable<any> {
    return this.httpClient.post(
      `${API_URL}/attendance/set/${id}`,
      {att: att,attId: attId}
    ).pipe(catchError(err=>{throw err}));
  }
}
