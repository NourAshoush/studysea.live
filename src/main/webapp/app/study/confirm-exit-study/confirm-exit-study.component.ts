import { Component, OnInit } from '@angular/core';
import { Account } from '../../core/auth/account.model';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { Subject, Subscription } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'jhi-confirm-exit-study',
  templateUrl: './confirm-exit-study.component.html',
  styleUrls: ['./confirm-exit-study.component.scss'],
})
export class ConfirmExitStudyComponent implements OnInit {
  account: Account | null = null;
  user: IUserExtended | null = null;

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;
  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private router: Router,
    public modalService: ModalService
  ) {}

  continueExit(): void {
    this.router.navigate(['/poststudy']);
  }

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accountId: number = account['id'];
      this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
        this.user = data;
      });
    });
  }

  ngOnDestroy(): void {
    this.modalService.showConfirmExitSessionStudy = false;
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }
}
