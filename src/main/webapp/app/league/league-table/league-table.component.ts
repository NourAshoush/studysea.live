import { Component, Input } from '@angular/core';
import { ILeagueTable } from '../../entities/league-table/league-table.model';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITask } from 'app/entities/task/task.model';
import { AfterStudyService } from 'app/entities/after-study/service/after-study.service';
import { IAfterStudy } from 'app/entities/after-study/after-study.model';
import { UserService } from 'app/entities/user/user.service';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

interface IUserExtendedWithStudyTime extends IUserExtended {
  totalStudyTime?: number;
  userLogin?: string;
  rank?: number;
}

@Component({
  selector: 'app-league-table',
  templateUrl: './league-table.component.html',
  styleUrls: ['./league-table.component.scss'],
})
export class LeagueTableComponent {
  @Input() league: ILeagueTable | null = null;
  memberUserExtendeds: IUserExtendedWithStudyTime[] = [];
  tasks: ITask[] = [];
  afterStudies: IAfterStudy[] = [];

  constructor(
    private taskService: TaskService,
    private afterStudyService: AfterStudyService,
    private userService: UserService,
    private userExtendedService: UserExtendedService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.league?.members) {
      this.memberUserExtendeds = this.league.members;
      await this.loadTasksAndAfterStudies();

      const userLoginMap = await this.fetchUserLogins();

      this.memberUserExtendeds.forEach(userExtended => {
        if (userExtended.id) {
          userExtended.userLogin = userLoginMap.get(userExtended.id);
        }
      });
    }
  }

  async loadTasksAndAfterStudies(): Promise<void> {
    return new Promise(resolve => {
      this.taskService.query().subscribe(response => {
        this.tasks = response.body || [];
        this.afterStudyService.query().subscribe(response => {
          this.afterStudies = response.body || [];
          this.calculateTotalStudyTimeForEachUser();
          resolve();
        });
      });
    });
  }
  fetchUserLogins(): Promise<Map<number, string>> {
    return new Promise(resolve => {
      const userLoginMap = new Map<number, string>();

      this.userService.query().subscribe(userResponse => {
        const users = userResponse.body || [];

        this.userExtendedService.query().subscribe(userExtendedResponse => {
          const userExtendeds = userExtendedResponse.body || [];

          users.forEach(user => {
            if (user.id && user.login) {
              const userExtended = userExtendeds.find(ue => ue.user?.id === user.id);
              if (userExtended && userExtended.id) {
                userLoginMap.set(userExtended.id, user.login);
              }
            }
          });

          resolve(userLoginMap);
        });
      });
    });
  }

  calculateTotalStudyTimeForEachUser(): void {
    this.memberUserExtendeds.forEach(userExtended => {
      const userTasks = this.tasks.filter(task => task.createdBy?.id === userExtended.id);
      userExtended.totalStudyTime = this.calculateTotalStudyTime(userTasks);
      userExtended.userLogin = userExtended.user?.login;
    });
    this.sortUsersByStudyTime();
  }

  calculateTotalStudyTime(tasks: ITask[]): number {
    let totalStudyTime = 0;
    tasks.forEach(task => {
      const afterStudy = this.afterStudies.find(as => as.task?.id === task.id);
      if (afterStudy) {
        totalStudyTime += this.durationToHours(afterStudy.timeSpent || '');
      }
    });
    return totalStudyTime;
  }

  sortUsersByStudyTime(): void {
    this.memberUserExtendeds.sort((a, b) => {
      return (b.totalStudyTime ?? 0) - (a.totalStudyTime ?? 0);
    });

    let currentRank = 1;
    let previousStudyTime = this.memberUserExtendeds[0]?.totalStudyTime ?? 0;

    this.memberUserExtendeds.forEach((userExtended, index) => {
      if (index > 0 && userExtended.totalStudyTime !== previousStudyTime) {
        currentRank = index + 1;
      }
      userExtended.rank = currentRank;
      previousStudyTime = userExtended.totalStudyTime ?? 0;
    });
  }

  durationToHours(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+(\.\d+)?S)?/);
    if (!match) {
      return 0;
    }
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    const totalHours = hours + minutes / 60 + seconds / 3600;
    return totalHours < 0.01 ? 0 : totalHours;
  }
}
