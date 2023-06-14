import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../shared/modal/modal.service';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { Account } from '../../core/auth/account.model';
import { Subject, Subscription } from 'rxjs';
import { IUser } from '../../admin/user-management/user-management.model';
import { StudyRoomService } from '../../shared/study-room.service';
import { ITask } from '../../entities/task/task.model';
import dayjs from 'dayjs/esm';
import { InitiateStudySessionService } from '../../shared/initiate-study-session.service';

@Component({
  selector: 'jhi-new-study-session',
  templateUrl: './new-study-session.component.html',
  styleUrls: ['./new-study-session.component.scss'],
})
export class NewStudySessionComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  user: IUserExtended | null = null;

  title = 'Instant Study Session';
  subject = 'Instant Study Session';
  breakLength = 5;
  studyLength = 25;
  tasks: ITask[];
  username: string | undefined;

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    public modalService: ModalService,
    public roomService: StudyRoomService,
    public initiateStudySessionService: InitiateStudySessionService
  ) {}

  startStudySession(): void {
    const postBody = {
      start: dayjs(),
      creation: dayjs(),
      title: this.title,
      subject: this.subject,
      studyLength: this.studyLength,
      breakLength: this.breakLength,
      completed: true,
      createdBy: {
        id: this.user?.id,
      },
    };

    // @ts-ignore
    this.http.post(`/api/tasks`, postBody).subscribe((response: ITask) => {
      //this.initiateStudySessionService.toggleCompletedFlag(response, true);
      this.roomService.resetVars();
      this.roomService.myTask = response;
      this.initiateStudySessionService.createStudySessionObject();
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  getUsername(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      this.username = data.login;
    });
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.modalService.showNewStudySession = false;
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setSubject(subject: string): void {
    this.subject = subject;
  }

  setBreakLength(length: string): void {
    this.breakLength = Number(length);
  }

  setStudyLength(length: string): void {
    this.studyLength = Number(length);
  }
}
