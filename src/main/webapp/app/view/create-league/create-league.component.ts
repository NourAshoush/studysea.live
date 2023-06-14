import { Component, OnDestroy, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal/modal.service';
import { Account } from '../../core/auth/account.model';
import { Subject, Subscription } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { LeagueTableService } from '../../entities/league-table/service/league-table.service';
import { Router } from '@angular/router';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-create-league',
  templateUrl: './create-league.component.html',
  styleUrls: ['./create-league.component.scss'],
})
export class CreateLeagueComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  userx: IUserExtended | null = null;
  futureMembers: IUserExtended[] = [];
  friends: IUserExtended[] = [];

  private readonly destroy$ = new Subject<void>();
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    public modalService: ModalService,
    public leagueTableService: LeagueTableService
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accountId: number = account['id']; // this is messy, but the value should always be provided
      this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
        this.userx = data;
        this.http.get<IUserExtended[]>(`/api/friends/by-userx/${data.id}`).subscribe(data2 => {
          this.friends = data2;
        });
      });
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.modalService.showCreateLeague = false;
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof this.subscription !== 'undefined') {
      this.subscription.unsubscribe();
    }
  }

  public toggleValue(friend: IUserExtended): void {
    if (!this.futureMembers.map(it => it.id).includes(friend.id)) {
      this.futureMembers.push(friend);
    } else {
      this.futureMembers = this.futureMembers.filter(it => it.id !== friend.id);
    }
  }

  public createLeague(): void {
    // yes the form is v bad. no i can't be bothered to rewrite this. i'm
    // writing this code at 5am and don't think i could physically stay
    // awake long enough to delete this and start again properly

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nameInput = document.getElementById('input-name').value;
    if (this.userx !== null) {
      this.futureMembers.push(this.userx);
    }
    this.leagueTableService
      .create({
        id: null,
        name: nameInput,
        members: this.futureMembers,
      })
      .subscribe();
    this.ngOnDestroy();
    this.router.navigate(['/league']);
  }
}
