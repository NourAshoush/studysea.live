import { Component, Input } from '@angular/core';
import { ITask } from 'app/entities/task/task.model';
import { AfterStudyService } from 'app/entities/after-study/service/after-study.service';

@Component({
  selector: 'jhi-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: ITask;
  constructor(private afterStudyService: AfterStudyService) {}
  timeSpent: number | null = null;

  ngOnInit(): void {
    this.fetchTimeSpent();
  }
  fetchTimeSpent(): void {
    if (!this.task || !this.task.id) {
      return;
    }

    this.afterStudyService
      .query({
        'task.equals': this.task.id,
      })
      .subscribe(response => {
        const afterStudies = response.body || [];
        const afterStudy = afterStudies.find(as => as?.task?.id === this.task.id);

        if (afterStudy && afterStudy.timeSpent) {
          this.timeSpent = this.durationToMinutes(afterStudy.timeSpent);
          console.log('task id:', this.task.id);
          console.log('timespent', this.timeSpent);
        } else if (!afterStudy) {
          this.timeSpent = null;
        }
      });
  }
  durationToMinutes(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+(\.\d+)?S)?/);
    if (!match) {
      return 0;
    }
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    const totalMinutes = hours * 60 + minutes + seconds / 60;

    // Calculate the value to 3 significant figures
    const roundedMinutes = parseFloat(totalMinutes.toPrecision(3));
    return roundedMinutes;
  }
}
