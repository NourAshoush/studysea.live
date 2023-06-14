import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../admin/user-management/user-management.model';
import { StudyRoomService } from '../shared/study-room.service';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs/esm';
import { ModalService } from '../shared/modal/modal.service';
import { IUserExtended } from '../entities/user-extended/user-extended.model';
import { ChatService } from '../shared/chat.service';
import { AnimateService } from '../shared/bg-animation/animate.service';

@Component({
  selector: 'jhi-break',
  templateUrl: './break.component.html',
  styleUrls: ['./break.component.scss'],
})
export class BreakComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  username: string;
  blockStudyEndTime: Dayjs;

  hueData: string;

  private readonly destroy$ = new Subject<void>();
  private subscription1: Subscription;
  private subscription2: Subscription;
  private blockLength: number;
  private startDelta: number;
  private blockStartTime: Dayjs;
  private currentBlock: number;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    public roomService: StudyRoomService,
    public modalService: ModalService,
    public chatService: ChatService,
    public animate: AnimateService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    if (this.roomService.roomCode === '') {
      this.router.navigate(['/view']);
    }

    this.getUsername();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line
    this.blockLength = (this.roomService.myTask.studyLength + this.roomService.myTask.breakLength) * 60 * 1000;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.startDelta = this.roomService.actualStartTime.diff();
    this.currentBlock = Math.floor((this.startDelta * -1) / this.blockLength);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.blockStartTime = this.roomService.actualStartTime.add(this.blockLength * this.currentBlock, 'ms');
    this.blockStudyEndTime = this.blockStartTime.add(this.blockLength, 'ms');

    const checkTime = (): void => {
      const currentTime = dayjs();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (currentTime.isAfter(this.blockStudyEndTime)) {
        this.router.navigate(['/study']);
      }
    };

    checkTime();
    this.subscription1 = interval(1000).subscribe(() => {
      checkTime();
    });

    const retrieveUsersInSession = (): void => {
      this.http.get<IUserExtended[]>(`/api/user-extendeds`).subscribe(data => {
        // console.log(data);
        const dataToCheck = data.filter(each => each.studySession?.id.toString() === this.roomService.roomCode);
        if (JSON.stringify(this.chatService.usersInSession) !== JSON.stringify(dataToCheck)) {
          this.chatService.usersInSession = dataToCheck;
        } else {
          // console.log(this.chatService.usersInSession);
        }
      });
    };

    retrieveUsersInSession();
    this.subscription2 = interval(3000).subscribe(() => {
      retrieveUsersInSession();
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription1 !== 'undefined') {
      this.subscription1.unsubscribe();
    }
    if (typeof this.subscription2 !== 'undefined') {
      this.subscription2.unsubscribe();
    }

    this.roomService.breakBlocksCompleted += 1;
  }

  getUsername(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.username = data.login;
      let hash = 0;
      const str = String(this.username);
      // let str = new String("admin");
      // console.log(str);
      if (str.length === 0) {
        this.hueData = hash.toString() + 'deg';
      }
      for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        // eslint-disable-next-line no-bitwise
        hash = hash & hash;
      }
      this.hueData = (hash % 360).toString() + 'deg';
      // console.log("as calculated by break component", this.hueData);
      // console.log("the username", this.username);
    });
  }
}
