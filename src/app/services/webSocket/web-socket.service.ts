import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocketSubject<any>;

  constructor() {
    this.socket = new WebSocketSubject('ws://localhost:3000');
  }

  getMessages() {
    return this.socket;
  }
}
