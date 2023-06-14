import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../core/auth/account.service';
import { Router } from '@angular/router';
import { Account } from '../core/auth/account.model';
import { Subject } from 'rxjs';
import { ModalService } from '../shared/modal/modal.service';
import { IUserExtended } from '../entities/user-extended/user-extended.model';
import { LeagueTableService } from '../entities/league-table/service/league-table.service';
import { HttpClient } from '@angular/common/http';
import { ILeagueTable } from '../entities/league-table/league-table.model';
import { UserSettingsService } from '../shared/user-settings.service';
import { AfterStudyService } from 'app/entities/after-study/service/after-study.service';
import { TaskService } from 'app/entities/task/service/task.service';
import { ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import { StudySessionService } from 'app/entities/study-session/service/study-session.service'; // Import the StudySessionService at the top of the file

@Component({
  selector: 'jhi-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  @ViewChild('barChart', { static: true }) barChartCanvas!: ElementRef;

  userx: IUserExtended | null = null;
  leagues: ILeagueTable[] = [];

  totalStudySessions: number = 0;
  totalHours: number = 0;
  totalTasks: number = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    public modalService: ModalService,
    private studySessionService: StudySessionService,

    private leagueTableService: LeagueTableService,
    private http: HttpClient,
    public userSettingsService: UserSettingsService,
    private taskService: TaskService,
    private afterStudyService: AfterStudyService
  ) {}

  async ngOnInit(): Promise<void> {
    this.accountService.getAuthenticationState().subscribe(async account => {
      this.account = account;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accountId: number = account['id']; // this is messy, but the value should always be provided
      const userxData = await this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).toPromise();
      this.userx = userxData ?? null;
      await this.getMyLeagues();
      await this.calculateTotals();
    });
    this.userSettingsService.setDisplayOnInit();
    await this.generateChart();
  }

  async generateChart(): Promise<void> {
    const startDate = new Date('2023-04-28');
    const today = new Date();
    const chartLabels: string[] = [];
    const chartData: number[] = [];

    for (let date = startDate; date <= today; date.setDate(date.getDate() + 1)) {
      const dateString = dayjs(date).format('DD/MM/YY');
      chartLabels.push(dateString);

      // Query all the tasks
      const tasks = await this.taskService.query().toPromise();
      const tasksBody = tasks?.body || [];

      // Filter tasks with a start date equal to the specific date and add the count to the chartData array
      const tasksOnDate = tasksBody.filter(task => {
        if (task.start) {
          const taskStartDate = task.start.get('year') + '-0' + (task.start.get('month') + 1) + '-' + task.start.get('date');
          return dayjs(taskStartDate).format('DD/MM/YY') === dateString;
        }
        return false;
      });
      chartData.push(tasksOnDate.length);
    }

    this.createBarChart(chartLabels, chartData);
  }

  async calculateTotals(): Promise<void> {
    let totalStudySessions = 0;
    let totalHours = 0;
    let totalTasks = 0;

    // Get the total number of tasks from the "task" entity
    const tasks = await this.taskService.query().toPromise();
    totalTasks += tasks?.body?.length || 0;

    // Get the total number of study sessions from the "study-session" entity
    const studySessions = await this.studySessionService.query().toPromise();
    totalStudySessions += studySessions?.body?.length || 0;

    // Calculate the total hours from the "after-study.timespent" values
    const afterStudies = await this.afterStudyService.query().toPromise();
    totalHours += afterStudies?.body?.reduce((sum, as) => sum + this.durationToHours(as.timeSpent || ''), 0) || 0;

    this.totalStudySessions = totalStudySessions;
    this.totalHours = totalHours;
    this.totalTasks = totalTasks;
  }

  createBarChart(chartLabels: string[], chartData: number[]): void {
    new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartData,
            label: 'Tasks Created',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
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

  async getMyLeagues(): Promise<void> {
    // note: this is *not* an efficient way of solving this problem, but it doesn't necessarily need to be
    const userxId = this.userx?.id;
    const data = await this.leagueTableService.query({ eagerload: true }).toPromise();
    if (data?.body != null) {
      data?.body.forEach(league => {
        const members = league.members?.map(it => it.id);
        if (userxId != null && members != null && members.includes(userxId)) {
          this.leagues.push(league);
        }
      });
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
