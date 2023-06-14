import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { IStudySession } from '../../entities/study-session/study-session.model';
import { ITask } from '../../entities/task/task.model';
import { IUser } from '../../admin/user-management/user-management.model';
import dayjs from 'dayjs/esm';
import { HttpClient } from '@angular/common/http';
import { StudyRoomService } from '../study-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-join-study-session',
  templateUrl: './join-study-session.component.html',
  styleUrls: ['./join-study-session.component.scss'],
})
export class JoinStudySessionComponent implements OnInit {
  @Input() studySessionToJoin: IStudySession;
  taskToJoin: ITask;
  iUser: IUser;
  iUserExtended: IUserExtended;

  sessionTitle: string | null | undefined;
  sessionSubject: string | null | undefined;

  titleProvidedCondition: boolean = true;
  subjectProvidedCondition: boolean = true;

  constructor(public modalService: ModalService, private http: HttpClient, private roomService: StudyRoomService, private router: Router) {}

  ngOnInit(): void {
    // Get the task to imitate
    // @ts-ignore
    this.http.get(`/api/tasks/${this.studySessionToJoin.task?.id}`).subscribe((taskToJoin: ITask) => {
      this.taskToJoin = taskToJoin;
      this.sessionTitle = taskToJoin.title;
      this.sessionSubject = taskToJoin.subject;
      // Get the current users' ID
      // @ts-ignore
      this.http.get('/api/account').subscribe((iUser: IUser) => {
        this.iUser = iUser;
        // Get the current users' UserExtended object
        // @ts-ignore
        this.http.get(`/api/user-extendeds/by-user/${iUser.id}`).subscribe((iUserExtended: IUserExtended) => {
          this.iUserExtended = iUserExtended;
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.modalService.showJoinBuddySession = false;
  }

  joinStudySession() {
    // Create task object based on the host user
    let postBody = {
      start: dayjs().toISOString(),
      creation: dayjs().toISOString(),
      title: this.sessionTitle,
      subject: this.sessionSubject,
      studyLength: this.taskToJoin.studyLength,
      breakLength: this.taskToJoin.breakLength,
      completed: true,
      createdBy: {
        id: this.iUserExtended.id,
      },
    };

    // @ts-ignore
    this.http.post('/api/tasks', postBody).subscribe((createdTask: ITask) => {
      // Quick validation check before continuing
      if (this.roomService.myTask == null) {
        this.roomService.myTask = createdTask;
        this.roomService.roomCode = this.studySessionToJoin.id.toString();
        this.roomService.actualStartTime = dayjs(this.studySessionToJoin.actualStart);
      } else return;

      let putBody = {
        id: this.iUserExtended.id,
        firstName: this.iUserExtended.firstName,
        lastName: this.iUserExtended.lastName,
        email: this.iUserExtended.email,
        status: this.iUserExtended.status,
        institution: this.iUserExtended.institution,
        course: this.iUserExtended.course,
        description: this.iUserExtended.description,
        privacy: this.iUserExtended.privacy,
        darkMode: this.iUserExtended.darkMode,
        user: this.iUserExtended.user,
        studySession: {
          id: this.roomService.roomCode,
        },
        leagues: this.iUserExtended.leagues,
      };

      this.http.put<IUserExtended>(`/api/user-extendeds/${this.iUserExtended.id}`, putBody).subscribe();

      // Get relevant time lengths for study/break period calculation
      let sessionStartTime = dayjs(this.studySessionToJoin.actualStart);
      // @ts-ignore
      let breakLength = 60 * this.taskToJoin.breakLength;
      // @ts-ignore
      let studyLength = 60 * this.taskToJoin.studyLength;

      let totalStudyCycleLength = breakLength + studyLength;

      let timeSinceStartInSeconds = dayjs().diff(sessionStartTime, 'second');

      // Calculate whether session is in study or break period
      if (timeSinceStartInSeconds % totalStudyCycleLength >= studyLength) {
        this.router.navigate(['/break']);
      } else this.router.navigate(['/study']);
    });
  }

  setTitle(sessionTitle: string) {
    this.sessionTitle = sessionTitle;
    this.titleProvidedCondition = sessionTitle != '';
  }

  setSubject(sessionSubject: string) {
    this.sessionSubject = sessionSubject;
    this.subjectProvidedCondition = sessionSubject != '';
  }
}
