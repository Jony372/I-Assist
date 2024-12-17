import { claseInterface } from "../class/class.interface";

export interface usuario {
  _id: string;
  profile_picture: string;
  name: string;
  last_name: string;
  birthdate: string;
  email: string;
  phone: string;
  control_number: string;
  is_teacher: boolean;
  password: string;
  classes: Array<claseInterface>;
  is_active: boolean;
  notifications: Array<Notification>;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  date: string;
  is_read: boolean;
}