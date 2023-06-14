import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import dayjs, { Dayjs } from 'dayjs';

// loosely based upon https://plainenglish.io/blog/implement-a-countdown-timer-with-rxjs-in-angular-3852f21a4ea0
@Component({
  selector: 'jhi-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() targetTime: dayjs.Dayjs;
  targetDate: dayjs.Dayjs;
  timeDifference: number;
  secondsRemaining: string;
  minutesRemaining: string;
  hoursRemaining: string;

  private subscription: Subscription | undefined;

  constructor() {
    this.timeDifference = 0;
    this.secondsRemaining = '??';
    this.minutesRemaining = '??';
    this.hoursRemaining = '??';
  }

  ngOnInit(): void {
    //console.warn(this.targetTime)

    if (typeof this.targetTime !== 'undefined') {
      //this.targetDate = new Date(this.targetTime).getTime();
      this.targetDate = this.targetTime;
    }
    this.getTimeDifference();

    this.subscription = interval(1000).subscribe(() => {
      this.getTimeDifference();

      //console.log(this.timeDifference)
    });
  }

  ngOnDestroy(): void {
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }

  private getTimeDifference(): void {
    if (typeof this.targetDate !== 'undefined') {
      this.timeDifference = this.targetDate.diff() + 1000;
      this.allocateUnits(this.timeDifference);
    } else {
      console.error('bad format!', this.targetDate);
    }
  }

  private allocateUnits(timeDifference: number): void {
    this.secondsRemaining = Math.floor((timeDifference / 1000) % 60)
      .toString()
      .padStart(2, '0');
    this.minutesRemaining = Math.floor((timeDifference / (60 * 1000)) % 60)
      .toString()
      .padStart(2, '0');
    this.hoursRemaining = Math.floor(timeDifference / (60 * 60 * 1000))
      .toString()
      .padStart(2, '0');
  }
}
