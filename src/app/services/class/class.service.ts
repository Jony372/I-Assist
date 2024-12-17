import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { claseInterface, claseData } from './class.interface';
import { API_URL } from '../../../assets/consts';
import { catchError, Observable } from 'rxjs';
import { usuario } from '../usuario/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private httpCliente: HttpClient) { }

  getClasses(): Observable<Array<claseInterface>>{
    return this.httpCliente.get<Array<claseInterface>>(
      `${API_URL}/classes/`
    ).pipe(catchError(err=>{throw err}));
  }

  createClass(classData: claseData): Observable<claseInterface>{
    return this.httpCliente.post<claseInterface>(
      `${API_URL}/classes/`, classData
    ).pipe(catchError(err=>{throw err}));
  }

  deleteClass(id: string): Observable<claseInterface>{
    return this.httpCliente.delete<claseInterface>(
      `${API_URL}/classes/delete/${id}`
    ).pipe(catchError(err=>{throw err}));
  }

  addStudent(class_code: string, student_id: string): Observable<any>{
    return this.httpCliente.post(
      `${API_URL}/classes/add-student`, {class_code, student_id}
    ).pipe(catchError(err=>{throw err}));
  }

  getClass(id: string): Observable<claseInterface>{
    return this.httpCliente.get<claseInterface>(
      `${API_URL}/classes/${id}`
    ).pipe(catchError(err=>{throw err}));
  }

  getAssist(code: string, student_id: string, class_id: string): Observable<any>{
    return this.httpCliente.post<any>(
      `${API_URL}/classes/assist/${code}`, {
      student_id: student_id,
      class_id: class_id
    }).pipe(catchError(err=>{throw err}));
  }

  setAllAttendance(attendance_id: string): Observable<any>{
    return this.httpCliente.post<any>(
      `${API_URL}/classes/all-attendance`, {
      attendance_id: attendance_id
    }).pipe(catchError(err=>{throw err}));
  }

  unsubscribeStudent(class_id: string, student_id: string): Observable<any>{
    return this.httpCliente.post<any>(
      `${API_URL}/classes/unsubscribe/${class_id}`, {
      student_id: student_id
    }).pipe(catchError(err=>{throw err}));
  }

  updateClass(classId: string, name: string, semester_id: string): Observable<any>{
    return this.httpCliente.post<any>(
      `${API_URL}/classes/update/${classId}`, {
      name: name,
      semester_id: semester_id
    }).pipe(catchError(err=>{throw err}));
  }

  getAttendancesChart(classId: string): Observable<any>{
    return this.httpCliente.get<any>(
      `${API_URL}/classes/attendances/${classId}`
    ).pipe(catchError(err=>{throw err}));
  }

  getStudentAttendancesChart(
    classId: string, studentId: string
  ):Observable<[number, number, number]>{
    return this.httpCliente.get<[number, number, number]>(
      `${API_URL}/classes/attendances-student/${classId}/${studentId}`
    ).pipe(catchError(err=>{throw err}));
  }

  getClassesByTeacher(id: string): Observable<Array<claseInterface>>{
    return this.httpCliente.get<Array<claseInterface>>(
      `${API_URL}/classes/teacher/${id}`
    ).pipe(catchError(err=>{throw err}));
  }

  getClassesByStudent(id: string): Observable<Array<claseInterface>>{
    return this.httpCliente.get<Array<claseInterface>>(
      `${API_URL}/classes/student/${id}`
    ).pipe(catchError(err=>{throw err}));
  }

  getStudentsByClass(id: string): Observable<Array<usuario>>{
    return this.httpCliente.get<Array<usuario>>(
      `${API_URL}/classes/students/${id}`
    ).pipe(catchError(err=>{throw err}));
  }
}
