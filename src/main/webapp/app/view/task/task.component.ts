import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ModalService } from '../../shared/modal/modal.service';
import { IUser } from '../../admin/user-management/user-management.model';
import { Account } from '../../core/auth/account.model';
import { Subject, Subscription, timestamp } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { ITask } from '../../entities/task/task.model';
import { TaskService } from '../../entities/task/service/task.service';
import { UserService } from '../../entities/user/user.service';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { InitiateStudySessionService } from '../../shared/initiate-study-session.service';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'jhi-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: ITask;
  account: Account | null = null;
  startTime: Date;
  studyLength: number;
  breakLength: number;
  title: string;
  subject: string;
  var: any;
  id: number | undefined;
  tasks: ITask[] = [];
  user: IUserExtended | null = null;
  time: Date;

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    public modalService: ModalService,
    public taskService: TaskService,
    public userService: UserService,
    private http: HttpClient,
    public newService: InitiateStudySessionService
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      // eslint-disable-next-line no-console
      console.log('account {}', this.account);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.id = this.account['id'];
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${this.id}`).subscribe(value => {
        this.user = value;
        // eslint-disable-next-line no-console
        console.log('the user {}', this.user);
        this.getTasks();

        // eslint-disable-next-line no-console
      });
    });
  }

  getTasks(): any {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.id = this.user?.id;
    this.taskService.getByUser(this.id).subscribe(value => {
      this.tasks = value;
    });
    // eslint-disable-next-line no-console
    console.log('the id {}', this.user?.id);
    // eslint-disable-next-line no-console
    console.log('task 1 {}', this.tasks);
    return this.tasks;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.modalService.showCreateTask = false;
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }

  getUsername(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.username = data.login;
    });
  }

  getStartTime(startTime: string): void {
    this.startTime = new Date(startTime);
  }

  getStudyLength(studyLength: string): void {
    this.studyLength = Number(studyLength);
  }

  getBreakLength(breakLength: string): void {
    this.breakLength = Number(breakLength);
  }

  getTitle(title: string): void {
    this.title = title;
  }

  getSubject(subject: string): void {
    this.subject = subject;
  }

  getTimeString(taskTime: Dayjs | null | undefined): string {
    if (taskTime === null || taskTime === undefined) {
      return '';
    }
    return taskTime.toString().substring(11, 16);
  }

  isOverdue(time: Dayjs | null | undefined): boolean {
    const now = new Date();
    if (time !== null && time !== undefined) {
      const timeString = time.toString();
      const tasktime = new Date(
        timeString.substring(5, 7) +
          '-' +
          timeString.substring(8, 10) +
          '-' +
          timeString.substring(0, 4) +
          ' ' +
          timeString.substring(11, 16)
      );
      if (tasktime.getTime() < now.getTime()) {
        return true;
      }
    }
    return false;
  }

  furmat(time: Dayjs | null | undefined): string {
    if (time !== null && time !== undefined) {
      const date = time.toString().substring(8, 10) + '/' + time.toString().substring(5, 7) + '/' + time.toString().substring(0, 4);
      return date;
    }
    return '';
  }

  isTomorrow(time: Dayjs | null | undefined): string {
    const now = new Date();
    const day = 1000 * 60 * 60 * 24;
    // @ts-ignore
    const timeString = time.toString();
    const tomorowPoint = new Date(now.getTime() + day);
    const todayBegin = new Date(now.getTime());
    todayBegin.setHours(0, 0, 0);
    const tomorrowStart = new Date(tomorowPoint.getTime());
    tomorrowStart.setHours(0, 0, 0);
    const tomorrowEnd = new Date(tomorowPoint.getTime());
    tomorrowEnd.setHours(23, 59, 59);
    const tasktime = new Date(
      timeString.substring(5, 7) + '-' + timeString.substring(8, 10) + '-' + timeString.substring(0, 4) + ' ' + timeString.substring(11, 16)
    );
    if (tasktime.getTime() > todayBegin.getTime() && tasktime.getTime() < tomorrowStart.getTime()) {
      return 'Today';
    } else if (tasktime.getTime() > tomorrowStart.getTime() && tasktime.getTime() < tomorrowEnd.getTime()) {
      return 'Tomorrow';
    }
    return this.furmat(time);
  }

  removeTask(task: ITask): void {
    this.http.delete<ITask>(`/api/tasks/${task.id}`).subscribe();
    this.getTasks();
  }
}
