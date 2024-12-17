import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ClassesComponent } from './main/classes/classes.component';
import { MainComponent } from './main/main.component';
import { ListasComponent } from './main/teacher/listas/listas.component';
import { IndexComponent } from './main/index/index.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'inicio',
    component: MainComponent,
    children: [
      {
        path: '',
        component: IndexComponent
      },
      {
        path: 'classes',
        component: ClassesComponent
      },
      {
        path: 'listas',
        redirectTo: 'classes'
      },
      {
        path: 'listas/:id',
        component: ListasComponent
      }
    ]
  }
];
