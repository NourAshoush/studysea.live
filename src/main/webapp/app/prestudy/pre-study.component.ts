import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { FormBuilder } from '@angular/forms';
import { StudyRoomService } from '../shared/study-room.service';

@Component({
  selector: 'jhi-prestudy',
  templateUrl: './pre-study.component.html',
  styleUrls: ['./pre-study.component.scss'],
})
export class PreStudyComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  endTime: string;

  roomForm = this.formBuilder.group({
    roomName: '',
  });

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roomService: StudyRoomService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }

  submitRoom(): void {
    const temp: string = <string>this.roomForm.value.roomName;
    if (temp.length > 0) {
      this.roomService.roomCode = temp;
      this.roomForm.controls.roomName.reset();

      this.router.navigate(['/break']);
    }
  }
}
