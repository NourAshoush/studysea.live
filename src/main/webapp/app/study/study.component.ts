import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { StudyRoomService } from '../shared/study-room.service';
import dayjs from 'dayjs/esm';
import { Dayjs } from 'dayjs';
import { ModalService } from '../shared/modal/modal.service';
import { AnimateService } from '../shared/bg-animation/animate.service';

@Component({
  selector: 'jhi-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  endTime: string;
  blockStudyEndTime: Dayjs;

  startTime: Dayjs;
  title: string;

  studyBlockLength: number | null | undefined;
  breakBlockLength: number | null | undefined;
  isDataAvailable = false;

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;
  private blockLength: number;
  private startDelta: number;
  private blockStartTime: Dayjs;
  private currentBlock: number;

  constructor(
    private accountService: AccountService,
    private router: Router,
    public roomService: StudyRoomService,
    public modalService: ModalService,
    public animate: AnimateService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.startTime = dayjs();

    if (this.roomService.roomCode === '' || this.roomService.myTask === null) {
      this.router.navigate(['/view']);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.title = this.roomService.myTask.title;

    this.isDataAvailable = true;

    // console.log(this.roomService.roomCode);
    // .title = this.roomService.myTask.title;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line
    this.blockLength = (this.roomService.myTask.studyLength + this.roomService.myTask.breakLength) * 60 * 1000;
    // console.log(typeof this.roomService.actualStartTime);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.startDelta = this.roomService.actualStartTime.diff();
    this.currentBlock = Math.floor((this.startDelta * -1) / this.blockLength);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.blockStartTime = this.roomService.actualStartTime.add(this.blockLength * this.currentBlock, 'ms');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.blockStudyEndTime = this.blockStartTime.add(this.roomService.myTask.studyLength * 60 * 1000, 'ms');

    const checkTime = (): void => {
      const currentTime = dayjs();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (currentTime.isAfter(this.blockStudyEndTime)) {
        this.router.navigate(['/break']);
      }
    };

    this.subscription = interval(1000).subscribe(() => {
      checkTime();
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }

    const endTime = dayjs();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const timeD = endTime.diff(this.startTime, 'seconds');
    this.roomService.timeSpentStudying += timeD;
    this.roomService.studyBlocksCompleted += 1;
    // console.log(timeD);
  }

  toggleAnimation(): void {
    this.animate.disabled = !this.animate.disabled;
  }
}
