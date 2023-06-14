import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { StudyRoomService } from '../shared/study-room.service';
import { IPost } from '../entities/post/post.model';
import { IUser } from '../admin/user-management/user-management.model';
import { HttpClient } from '@angular/common/http';
import { IUserExtended } from '../entities/user-extended/user-extended.model';
import { InitiateStudySessionService } from '../shared/initiate-study-session.service';
import { IAfterStudy } from '../entities/after-study/after-study.model';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import { ITask } from '../entities/task/task.model';

@Component({
  selector: 'jhi-prestudy',
  templateUrl: './post-study.component.html',
  styleUrls: ['./post-study.component.scss'],
})
export class PostStudyComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  username: string | undefined;
  afterStudyObj: IAfterStudy;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    public roomService: StudyRoomService,
    public initiateStudySessionService: InitiateStudySessionService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    //this is probably redundant as this method is called when study session starts. However on testing...
    // it's been observed that some tasks have had a completed flag of false when they've been completed.
    // This should fix any issues.
    if (this.roomService.myTask != null) {
      this.initiateStudySessionService.toggleCompletedFlag(this.roomService.myTask, true);
    }

    //@ts-ignore
    this.http.get('/api/account').subscribe((user: IUser) => {
      //@ts-ignore
      this.http.get(`/api/user-extendeds/by-user/${user.id}`).subscribe((userExtended: IUserExtended) => {
        // @ts-ignore
        this.http.get(`/api/user-extendeds`).subscribe((allUsersX: IUserExtended[]) => {
          let filtered = allUsersX.filter(obj => obj.studySession?.id.toString() == this.roomService.roomCode);

          let putBody = {
            id: userExtended.id,
            firstName: userExtended.firstName,
            lastName: userExtended.lastName,
            email: userExtended.email,
            status: userExtended.status,
            institution: userExtended.institution,
            course: userExtended.course,
            description: userExtended.description,
            privacy: userExtended.privacy,
            darkMode: userExtended.darkMode,
            user: userExtended.user,
            studySession: null,
            leagues: userExtended.leagues,
          };

          this.http.put<IUserExtended>(`/api/user-extendeds/${userExtended.id}`, putBody).subscribe(() => {
            if (filtered.length == 1) {
              this.http.delete(`/api/study-sessions/${this.roomService.roomCode}`).subscribe(() => {
                this.finaliseExitSession();
              });
            } else {
              this.finaliseExitSession();
            }
          });
        });
      });
    });
  }

  finaliseExitSession(): void {
    //reset all the variables in the study room service files (which is shared)
    let postBody = {
      timeSpent: 'PT' + this.roomService.timeSpentStudying + 'S',
      task: {
        id: this.roomService.myTask?.id,
      },
    };

    // @ts-ignore
    this.http.post('/api/after-studies', postBody).subscribe((afterStudyObj: IAfterStudy) => {
      this.afterStudyObj = afterStudyObj;
      this.roomService.resetVars();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  makePost(): void {
    // @ts-ignore
    this.http.get('/api/account').subscribe((user: IUser) => {
      // @ts-ignore
      this.http.get(`/api/tasks/${this.afterStudyObj.task?.id}`).subscribe((taskObj: ITask) => {
        // @ts-ignore
        let timeSpentStudyingDuration = dayjs.duration(this.afterStudyObj.timeSpent);
        let timeSpentStudyingStr;

        if (timeSpentStudyingDuration.asSeconds() >= 60) {
          if (timeSpentStudyingDuration.asMinutes() >= 60) {
            timeSpentStudyingStr =
              timeSpentStudyingDuration.asHours().toFixed(1).toString() + (timeSpentStudyingDuration.asHours() == 1 ? ' hour' : ' hours');
          } else
            timeSpentStudyingStr =
              timeSpentStudyingDuration.asMinutes().toFixed(0).toString() +
              (timeSpentStudyingDuration.asMinutes().toFixed(0).toString() == '1' ? ' minute' : ' minutes');
        } else
          timeSpentStudyingStr =
            timeSpentStudyingDuration.asSeconds().toFixed(0).toString() +
            (timeSpentStudyingDuration.asSeconds().toFixed(0).toString() == '1' ? ' second' : ' seconds');

        let newPost = {
          createdBy: user.login,
          creationTime: dayjs(),
          title: `${user.login} studied a bit of "${taskObj.subject}" today!`,
          description: `${user.login} studied ${taskObj.title} for "${timeSpentStudyingStr}". You should do some studying too!`,
          likes: 0,
          likedBy: '',
        };

        this.http
          .post<IPost>('/api/posts', newPost)
          .subscribe()
          .add(() => {
            this.router.navigate(['/feed']);
          });
      });
    });
  }
}
