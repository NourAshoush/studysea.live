// donut-chart.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ITask } from '../../../entities/task/task.model';
import { TaskService } from '../../../entities/task/service/task.service';
import { AccountService } from 'app/core/auth/account.service';
import { UserExtendedService } from '../../../entities/user-extended/service/user-extended.service';
import { IAfterStudy } from '../../../entities/after-study/after-study.model';
import { AfterStudyService } from '../../../entities/after-study/service/after-study.service';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit {
  @ViewChild('donut', { static: true }) donutCanvas!: ElementRef;

  constructor(
    private tasksService: TaskService,
    private accountService: AccountService,
    private userExtendService: UserExtendedService,

    private afterStudyService: AfterStudyService
  ) {}

  userId?: number | null;
  public userHasStudied: boolean = false;
  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account && account.login) {
        this.userExtendService.query().subscribe(userExtendsResponse => {
          const userExtends = userExtendsResponse.body || [];
          const userExtend = userExtends.find(ue => ue.user?.login === account.login);
          if (userExtend && userExtend.id) {
            this.userId = userExtend.id;
            this.fetchTasksData();
          } else {
            console.error('Error fetching user-extend id.');
          }
        });
      } else {
        console.error('Error fetching account login.');
      }
    });
  }

  createDonutChart(tasksData: any[]): void {
    const dataLabels = tasksData.map(task => task.id);

    new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: tasksData,

            backgroundColor: tasksData.map(task => this.subjectColors[task.id]), // Use the unique colors for each subject,
          },
        ],
        labels: dataLabels, // Replace hardcoded labels with the processed unique subjects
      }, //edit this to be tasksData

      options: {
        backgroundColor: '#99ffff',
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        parsing: {
          key: 'nested.value',
        },
        plugins: {
          tooltip: {
            titleAlign: 'center',
            displayColors: false,
            callbacks: {
              label: context => {
                // @ts-ignore
                let time = context.raw.nested.value;
                return `You have studied it for ${time} hours`;
              },
            },
            mode: 'point',
            intersect: true,
          },
          legend: {
            position: 'left',
            labels: {
              font: {
                size: 20,
              },
              padding: 20,
            },
          },
        },
      },
    });
  }
  fetchTasksData(): void {
    this.tasksService.query().subscribe(
      (taskRes: HttpResponse<ITask[]>) => {
        const allTasks = taskRes.body || [];
        this.afterStudyService.query().subscribe(
          (afterStudyRes: HttpResponse<IAfterStudy[]>) => {
            const allAfterStudies = afterStudyRes.body || [];

            // Combine tasks and after studies data
            const tasksWithAfterStudies = allTasks.map(task => {
              const relatedAfterStudy = allAfterStudies.find(afterStudy => afterStudy.task?.id === task.id);
              return {
                ...task,
                afterStudy: relatedAfterStudy,
              };
            });

            const userTasks = tasksWithAfterStudies.filter(
              task =>
                task.createdBy?.id === this.userId &&
                task.afterStudy &&
                task.afterStudy.timeSpent !== null &&
                task.afterStudy.timeSpent !== undefined
            );
            console.log('usertasks', userTasks);
            const tasksData = this.processTasksData(userTasks);
            this.userHasStudied = tasksData.some(taskData => taskData.nested.value > 0);
            console.log('userhasstudied', this.userHasStudied);
            this.createDonutChart(tasksData);
          },
          () => {
            console.error('Error fetching after studies data.');
          }
        );
      },
      () => {
        console.error('Error fetching tasks data.');
      }
    );
  }
  public subjectColors: { [subject: string]: string } = {}; // Add this property to the class to store unique colors

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
  processTasksData(tasks: any[]): any[] {
    // Initialize the total time spent on tasks for each subject to zero
    const subjectTimeSpent: { [subject: string]: number } = {};

    // Iterate through the tasks
    tasks.forEach(task => {
      // Check if the subject is not null and not undefined
      if (task.subject !== null && task.subject !== undefined) {
        // Initialize the subject's total time if it doesn't exist in the object
        if (!subjectTimeSpent[task.subject]) {
          subjectTimeSpent[task.subject] = 0;
        }

        // Add the timeSpent value from the task's afterStudy field to the corresponding subject's total time
        if (task.afterStudy && task.afterStudy.timeSpent !== null && task.afterStudy.timeSpent !== undefined) {
          subjectTimeSpent[task.subject] += this.durationToHours(task.afterStudy.timeSpent);
        }
      }
    });

    // Create the unique colors for each unique subject
    tasks.forEach(task => {
      if (task.subject && !this.subjectColors[task.subject]) {
        this.subjectColors[task.subject] = this.generateRandomColor(); // Generate and store a unique color for the subject
      }
    });

    // Convert the object containing the total time spent on tasks for each subject into an array with a format suitable for the chart
    return Object.entries(subjectTimeSpent).map(([subject, time]) => ({
      id: subject,
      nested: { value: parseFloat(time.toFixed(2)) },
    }));
  }

  private generateRandomColor(): string {
    const lowerLimit = 50;
    const upperLimit = 200;

    const randomIntInRange = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const r = randomIntInRange(lowerLimit, upperLimit);
    const g = randomIntInRange(lowerLimit, upperLimit);
    const b = randomIntInRange(lowerLimit, upperLimit);

    return `rgb(${r},${g},${b})`;
  }
}
