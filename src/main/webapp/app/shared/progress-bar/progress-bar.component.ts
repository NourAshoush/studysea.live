import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import dayjs, { Dayjs } from 'dayjs';

// loosely based upon https://plainenglish.io/blog/implement-a-countdown-timer-with-rxjs-in-angular-3852f21a4ea0
@Component({
  selector: 'jhi-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  @Input() targetTime: dayjs.Dayjs;
  progressBar: any;

  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.progressBar = document.querySelector('#progress-bar');
    //console.warn(this.targetTime)
    const start = dayjs(new Date());
    this.getProgress(start);
    this.subscription = interval(1000).subscribe(() => {
      this.getProgress(start);
    });
  }

  ngOnDestroy(): void {
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }

  getProgress(start: Dayjs): void {
    const now = dayjs(new Date());
    const whole = start.diff(this.targetTime);
    const progress = now.diff(this.targetTime);
    const progressPercent = ((whole - progress) / whole) * 100;
    this.progressBar.style.width = progressPercent.toString() + '%';
  }
}
