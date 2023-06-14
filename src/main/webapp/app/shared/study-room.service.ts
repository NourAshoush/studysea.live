import { Injectable } from '@angular/core';
import { ITask } from '../entities/task/task.model';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class StudyRoomService {
  myTask: ITask | null | undefined = null;

  roomCode = '';

  // timeSpentStudying is in seconds
  timeSpentStudying = 0;

  // actualStartTime = dayjs();
  actualStartTime: dayjs.Dayjs | null;

  breakBlocksCompleted = 0;
  studyBlocksCompleted = 0;

  flag = false;

  public resetVars(): void {
    this.myTask = null;
    this.roomCode = '';
    this.timeSpentStudying = 0;
    this.actualStartTime = null;
    this.breakBlocksCompleted = 0;
    this.studyBlocksCompleted = 0;
    this.flag = false;
  }
}
