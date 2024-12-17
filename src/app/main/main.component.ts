import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PanelComponent } from '../panel/panel.component';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, PanelComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(private userAuth: UserAuthService, private router: Router) { }
  ngOnInit(){
    if(!this.userAuth.verifyUser()){
      this.router.navigate(['/login']);
    }
  }
}
