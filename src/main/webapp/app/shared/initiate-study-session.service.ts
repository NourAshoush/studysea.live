import { Injectable } from '@angular/core';
import { IUser } from '../entities/user/user.model';
import { IUserExtended } from '../entities/user-extended/user-extended.model';
import dayjs from 'dayjs';
import { StudyRoomService } from './study-room.service';
import { AccountService } from '../core/auth/account.service';
import { Router } from '@angular/router';
import { ModalService } from './modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { StudySessionService } from '../entities/study-session/service/study-session.service';
import { ITask } from '../entities/task/task.model';
import { IStudySession } from '../entities/study-session/study-session.model';

@Injectable({
  providedIn: 'root',
})
export class InitiateStudySessionService {
  tasks: ITask[];
  constructor(
    private accountService: AccountService,
    public router: Router,
    public roomService: StudyRoomService,
    private http: HttpClient
  ) {}

  public getTaskInformation(chosenTask: ITask): void {
    this.roomService.resetVars();
    this.roomService.myTask = chosenTask;

    //prevents any task with completed==true from being processed
    if (chosenTask.completed == true) {
      this.roomService.resetVars();
      return;
    }

    this.toggleCompletedFlag(chosenTask, true);
    this.createStudySessionObject();
  }

  public createStudySessionObject(): void {
    //@ts-ignore
    this.http.get('/api/account').subscribe((user: IUser) => {
      //@ts-ignore
      this.http.get(`/api/user-extendeds/by-user/${user.id}`).subscribe((userExtended: IUserExtended) => {
        if (this.roomService.myTask != null) {
          let postBody = {
            actualStart: dayjs(),
            isPrivate: false,
            task: {
              id: this.roomService.myTask.id,
            },
            owner: { id: userExtended.id },
          };
          // @ts-ignore
          this.http.post('/api/study-sessions', postBody).subscribe((response: IStudySession) => {
            this.roomService.roomCode = response.id.toString();
            this.roomService.actualStartTime = dayjs(response.actualStart);

            if (this.roomService.myTask != null) {
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
                studySession: {
                  id: this.roomService.roomCode,
                },
                leagues: userExtended.leagues,
              };
              this.http.put<IUserExtended>(`/api/user-extendeds/${userExtended.id}`, putBody).subscribe(() => {
                this.router.navigate(['/study']);
              });
            }
          });
        } else {
          // SHOULD SOMETHING ELSE HAPPEN HERE INSTEAD?
          //returning 'void' has the effect of not performing any steps upon pressing the start task button
          return;
        }
      });
    });
  }

  public toggleCompletedFlag(taskObj: ITask, newFlag: boolean): void {
    taskObj.completed = newFlag;

    /*if (taskObj.completed == false) {
      taskObj.completed = true;
      console.log('completed flag made true');
    } else {
      taskObj.completed = false;
      console.log('completed flag made false');
    }*/

    let putBody = {
      id: taskObj.id,
      start: taskObj.start,
      creation: taskObj.creation,
      title: taskObj.title,
      subject: taskObj.subject,
      studyLength: taskObj.studyLength,
      breakLength: taskObj.breakLength,
      completed: taskObj.completed,
      createdBy: taskObj.createdBy,
    };

    this.http.put<ITask>('/api/tasks/' + taskObj.id, putBody).subscribe();
  }
}
