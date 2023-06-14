import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatComponent } from './chat/chat.component';
import { BehaviorSubject } from 'rxjs';
import { IUserExtended } from '../entities/user-extended/user-extended.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  public messages: any;
  public usersInSession: IUserExtended[];
  private listening = false;
  constructor(private socket: Socket) {}

  public sendMessage(message_type: string, message: any): void {
    console.log(`${message_type}: ${message}`);
    if (message.message == 'list.rooms') {
      console.log('list rooms');
      this.socket.emit('list rooms', message);
    } else {
      console.log('normal message');
      this.socket.emit(message_type, message);
    }
  }

  public updateRoom(room: string | null, callback: () => void): void {
    console.log(`update room: ${room} `);
    let newRoom: string;
    if (room !== null) {
      newRoom = room;

      this.socket.emit('update room', newRoom);
    }
    callback();
  }

  public getNewMessage = () => {
    if (!this.listening) {
      console.log('getNewMessage called');

      //handle chat message
      this.socket.on('chat message', (msg: any) => {
        console.log('received chat message', msg);
        this.messages.push(msg);
      });

      //handle user joined
      this.socket.on('new user', (payload: any) => {
        console.log('payload', payload);
        this.usersInSession = payload.data;
      });

      this.listening = true;
    }
  };
}
