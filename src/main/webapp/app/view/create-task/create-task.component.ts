import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs/esm';

import { ModalService } from '../../shared/modal/modal.service';
import { IUser } from '../../admin/user-management/user-management.model';
import { Account } from '../../core/auth/account.model';
import { Subject, Subscription } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { start } from '@popperjs/core';

@Component({
  selector: 'jhi-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  account: Account | null = null;
  user: IUserExtended | null = null;
  startTime: dayjs.Dayjs;
  studyLength: number;
  breakLength: number;
  title: string;
  subject: string;

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.startTime = dayjs().add(1, 'hour');
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accountId: number = account['id'];
      this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
        this.user = data;
      });
    });
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
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // @ts-ignore
      this.username = data.login;
    });
  }

  getStartTime(startTime: string): void {
    this.startTime = dayjs(startTime).add(1, 'hour');
  }

  getStudyLength(studyLength: string): void {
    this.studyLength = Number(studyLength);
    if (this.studyLength == null) this.studyLength = 5;
  }

  getBreakLength(breakLength: string): void {
    this.breakLength = Number(breakLength);
    if (this.breakLength == null) this.breakLength = 25;
  }

  getTitle(title: string): void {
    this.title = title;
  }

  getSubject(subject: string): void {
    this.subject = subject;
  }

  public saveTask() {
    //Add task to database
    let newTask = {
      start: this.startTime.toISOString(),
      creation: dayjs().toISOString(),
      title: this.title,
      subject: this.subject,
      studyLength: this.studyLength,
      breakLength: this.breakLength,
      completed: false,
      createdBy: {
        id: this.user?.id,
      },
    };

    this.http.post('/api/tasks', newTask).subscribe();

    this.ngOnDestroy();
    window.location.reload();
  }
}
