import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormBuilder } from '@angular/forms';
import { StudyRoomService } from '../study-room.service';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../entities/user/user.model';
import { HttpClient } from '@angular/common/http';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { UserExtendedService } from '../../entities/user-extended/service/user-extended.service';
import { supportsEventListenerOptions } from 'chart.js/helpers';

interface Message {
  type: string;
  message: string;
  room?: string;
  hue?: string;
}

@Component({
  selector: 'jhi-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() hueDataFromBreak: string;
  rooms: string[];
  hue: string;
  username: string;

  myRoom: string | null;
  chatForm = this.formBuilder.group({
    msg: '',
  });

  constructor(
    private roomService: StudyRoomService,
    public chatService: ChatService,
    private formBuilder: FormBuilder,
    public http: HttpClient,
    public userExtendedService: UserExtendedService
  ) {
    this.hue = '216deg';
  }

  ngOnInit(): void {
    // this.chatService.addCallback('chat message', this.chatMessageReceived, this);
    //this.messages = [];
    this.myRoom = this.roomService.roomCode;
    this.chatService.updateRoom(this.myRoom, () => {
      this.chatService.getNewMessage();
    });

    // this.hue = Math.floor(Math.random() * 255).toString() + 'deg';
    this.getUsername();
    console.log(this.hue);

    if (!this.roomService.flag) {
      this.chatService.messages = [
        {
          type: 'status',
          message: 'welcome to chat!',
        },
      ];
    }
    this.roomService.flag = true;
  }

  sendMessage(): void {
    const msg: string = <string>this.chatForm.value.msg;
    this.chatForm.controls.msg.reset();
    if (msg.length > 0) {
      // const message = JSON.stringify({ type: 'them', message: msg, hue: this.hue });
      const message = {
        type: 'them',
        message: msg,
        room: this.myRoom,
        hue: this.hue,
      };
      this.chatService.sendMessage('chat message', message);
      this.chatService.messages.push({ type: 'me', message: msg });
    }
  }

  getUsername(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // @ts-ignore
      this.username = data.login;
      let hash = 0;
      let str = new String(this.username);
      // let str = new String("admin");
      // console.log(str);
      if (str.length == 0) {
        this.hue = hash.toString() + 'deg';
      }
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }
      this.hue = (hash % 360).toString() + 'deg';
      // console.log("as calculated by break component", this.hueData);
      // console.log("the username", this.username);
    });
  }
}
