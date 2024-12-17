import { usuario } from "../usuario/usuario.interface";

export interface attendanceInterface {
  _id: string;
  day: string;
  class: string;
  attendance: [{
    _id: string;
    student: usuario;
    attendance: number;
  }]
}