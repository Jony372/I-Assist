import { semester } from "../semester/semester.interface";
import { usuario } from "../usuario/usuario.interface";

export interface claseInterface {
  _id: string;
  name: string;
  semester: semester;
  teacher: usuario;
  estado: boolean;
  students: Array<usuario>;
  schedules: Array<scheduleInterface>
  code: string;
  assist_code: string;
}

export interface claseData {
  name: string;
  semester_id: string;
  teacher_id: string;
  schedules: Array<scheduleInterface>
}

export interface scheduleInterface {
  _id: string;
  day: string;
  start: string;
  end: string;
}