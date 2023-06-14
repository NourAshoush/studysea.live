import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ModalService } from '../shared/modal/modal.service';
import { StudyRoomService } from '../shared/study-room.service';
import { StudySessionService } from '../entities/study-session/service/study-session.service';
import { IStudySession } from '../entities/study-session/study-session.model';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../entities/user/user.model';
import { IUserExtended } from '../entities/user-extended/user-extended.model';
import { UserSettingsService } from '../shared/user-settings.service';

@Component({
  selector: 'jhi-study',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  sessions: IStudySession[] = [];
  studySessionToJoin: IStudySession;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    public modalService: ModalService,
    public roomService: StudyRoomService,
    public studySessionService: StudySessionService,
    public http: HttpClient,
    public userSettingsService: UserSettingsService
  ) {}

  removeUnwantedSession(): void {
    // @ts-ignore
    this.http.get(`/api/account`).subscribe((user: IUser) => {
      // @ts-ignore
      this.http.get(`/api/user-extendeds/by-user/${user.id}`).subscribe((userEx: IUserExtended) => {
        let putBody = {
          id: userEx.id,
          firstName: userEx.firstName,
          lastName: userEx.lastName,
          email: userEx.email,
          status: userEx.status,
          institution: userEx.institution,
          course: userEx.course,
          description: userEx.description,
          privacy: userEx.privacy,
          darkMode: userEx.darkMode,
          user: userEx.user,
          studySession: null,
          leagues: userEx.leagues,
        };
        this.http.put<IUserExtended>(`/api/user-extendeds/${userEx.id}`, putBody).subscribe(() => {
          if (userEx.studySession == null) {
            return;
          } else {
            // @ts-ignore
            this.http.delete(`/api/study-sessions/${userEx.studySession.id}`).subscribe();
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.removeUnwantedSession();
    this.userSettingsService.setDisplayOnInit();

    this.studySessionService.getPublicSession().subscribe(value => {
      this.sessions = value;
    });

    // console.log(this.tasks[0].subject);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openJoinSessionModal(studySessionToJoin: IStudySession) {
    this.studySessionToJoin = studySessionToJoin;
    this.modalService.showJoinBuddySession = true;
  }
}
