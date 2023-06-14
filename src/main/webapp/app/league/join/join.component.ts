import { Component, OnInit } from '@angular/core';
import { Account } from '../../core/auth/account.model';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { AccountService } from '../../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ILeagueTable } from '../../entities/league-table/league-table.model';
import { LeagueTableService } from '../../entities/league-table/service/league-table.service';

@Component({
  selector: 'jhi-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {
  account: Account | null = null;

  public userx: IUserExtended | null = null;
  public league: ILeagueTable | null = null;
  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private leagueTableService: LeagueTableService
  ) {}

  ngOnInit(): void {
    this.getLeague();
    this.getUserx();
  }

  getUserx(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accountId: number = account['id']; // this is messy, but the value should always be provided
      this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
        this.userx = data;
      });
    });
  }

  getLeague(): void {
    this.route.paramMap.subscribe((params: Params) => {
      const league_id = parseInt(params.params?.id ?? '-1', 10);
      if (league_id !== -1) {
        this.leagueTableService.find(league_id).subscribe(data => {
          this.league = data.body;
        });
      }
    });
  }

  joinLeague(): void {
    this.getLeague(); // ensure up-to-date
    if (this.league?.members == null || this.userx == null || this.alreadyMember()) {
      return;
    }

    this.league.members.push(this.userx);
    this.leagueTableService.update(this.league).subscribe();
    this.router.navigate(['/league']);
  }

  alreadyMember(): boolean {
    if (this.league?.members == null || this.userx == null) {
      return false;
    } else {
      const members = this.league.members.map(item => item.id);
      return members.includes(this.userx.id);
    }
  }
}
