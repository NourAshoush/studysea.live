import { Component, OnInit } from '@angular/core';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITask } from 'app/entities/task/task.model';
import { IAfterStudy } from 'app/entities/after-study/after-study.model';
import { AfterStudyService } from 'app/entities/after-study/service/after-study.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';
import { HttpResponse } from '@angular/common/http';
import { UserSettingsService } from '../shared/user-settings.service';

@Component({
  selector: 'jhi-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  tasks: ITask[] = [];
  afterStudies: IAfterStudy[] = [];
  totalTasks = 0;
  tasksCreatedThisWeek = 0;
  completedTasks = 0;
  totalStudyTime = 0;
  lowestStudiedTimeTask: ITask | null = null;
  dataLoadedCounter = 0;

  private currentUserExtended: IUserExtended | null = null;

  constructor(
    private taskService: TaskService,
    private accountService: AccountService,
    private userExtendedService: UserExtendedService,
    private afterStudyService: AfterStudyService,
    public userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.fetchCurrentUserExtended();
    this.userSettingsService.setDisplayOnInit();
  }

  fetchCurrentUserExtended(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userExtendedService.query().subscribe((res: HttpResponse<IUserExtended[]>) => {
          this.currentUserExtended = (res.body || []).find(userExtended => userExtended.user?.login === account.login) || null;
          this.loadTasks();
          this.loadAfterStudies();
        });
      }
    });
  }

  loadTasks(): void {
    if (!this.currentUserExtended) {
      return;
    }
    this.taskService.query().subscribe(response => {
      this.tasks = (response.body || []).filter(task => task.createdBy?.id === this.currentUserExtended?.id);
      this.incrementDataLoadedCounter();
    });
  }

  loadAfterStudies(): void {
    this.afterStudyService.query().subscribe(response => {
      this.afterStudies = response.body || [];
      this.incrementDataLoadedCounter();
    });
  }
  incrementDataLoadedCounter(): void {
    this.dataLoadedCounter++;
    if (this.dataLoadedCounter === 2) {
      this.calculateTaskMetrics();
    }
  }

  calculateTaskMetrics(): void {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    this.totalTasks = this.tasks.length;
    this.tasksCreatedThisWeek = this.tasks.filter(task => new Date(task.creation?.toDate() || '') >= oneWeekAgo).length;
    this.completedTasks = this.tasks.filter(task => task.completed).length;

    // Calculate total study time and find the lowest studied time task
    let minStudyTime = Number.MAX_VALUE;
    this.tasks.forEach(task => {
      const afterStudy = this.afterStudies.find(as => as.task?.id === task.id);
      if (afterStudy) {
        const timeSpent = this.durationToHours(afterStudy.timeSpent || '');
        this.totalStudyTime += timeSpent;
        if (timeSpent < minStudyTime) {
          minStudyTime = timeSpent;
          this.lowestStudiedTimeTask = task;
        }
      }
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
    return hours + minutes / 60 + seconds / 3600;
  }
}
