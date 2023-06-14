import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserListComponent } from './userList/userList.component';

@Injectable({ providedIn: 'root' })
export class UserListService {
  constructor(private socket: Socket) {}

  sendMessage(message_type: string, message: string): void {
    this.socket.emit(message_type, message);
  }
  addCallback(message_type: string, func: (component: UserListComponent, msg: string) => void, component: UserListComponent): void {
    function partial(msg: string): void {
      return func(component, msg);
    }
    this.socket.on(message_type, partial);
  }

  removeCallback(message_type: string, func: (msg: string) => void): void {
    this.socket.removeListener(message_type, func);
  }
}
