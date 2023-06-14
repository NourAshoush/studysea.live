import { Component, OnInit } from '@angular/core';
import { Account } from '../../core/auth/account.model';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { AccountService } from '../../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IFriend } from '../../entities/friend/friend.model';

@Component({
  selector: 'jhi-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  account: Account | null = null;

  public userx: IUserExtended | null = null;
  public friendx: IUserExtended | null = null;
  public friends: Array<number> = [];
  constructor(private accountService: AccountService, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: Params) => {
      const user_id = parseInt(params.params?.id ?? '-1', 10);
      if (user_id !== -1) {
        this.http.get<IUserExtended>(`/api/user-extendeds/${user_id}`).subscribe(
          data => (this.friendx = data),
          () => {
            this.friendx = null;
          }
        );
      }
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accountId: number = account['id']; // this is messy, but the value should always be provided
      this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
        this.userx = data;
        this.http.get<Array<IFriend>>(`/api/friends/by-userx/${this.userx.id}`).subscribe(data2 => {
          this.friends = data2.map(val => val.id);
        });
      });
    });
  }

  addFriend(): void {
    this.http.post<Array<IUserExtended>>('/api/friends/by-userx', [this.userx, this.friendx]).subscribe();
    this.router.navigate(['/view']);
  }
}
