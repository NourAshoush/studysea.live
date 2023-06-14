import { Component, OnInit } from '@angular/core';
import { Account } from '../core/auth/account.model';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from '../core/auth/account.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUserExtended } from '../entities/user-extended/user-extended.model';
import { IUser } from '../entities/user/user.model';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ITask } from '../entities/task/task.model';
import { ILeagueTable } from '../entities/league-table/league-table.model';
import { IAfterStudy } from '../entities/after-study/after-study.model';
import { IPost } from '../entities/post/post.model';

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();
  firstname: string | null | undefined;
  lastname: string | null | undefined;
  email: string | null | undefined;
  description: string | null | undefined;
  course: string | null | undefined;
  institution: string | null | undefined;
  faUser = faUser;
  numTasks: number | null | undefined;
  numPosts: number | null | undefined;
  numFriends: number | null | undefined;
  numLeagues: number | null | undefined = 0;
  numHours: number | null | undefined;

  constructor(private accountService: AccountService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    //@ts-ignore
    document.getElementById('edit-button').addEventListener('click', () => {
      this.router.navigate(['/account/settings']);
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    //@ts-ignore
    this.http.get('/api/account').subscribe((user: IUser) => {
      //@ts-ignore
      this.http.get(`/api/user-extendeds/by-user/${user.id}`).subscribe((userExtended: IUserExtended) => {
        this.firstname = userExtended.firstName;
        this.lastname = userExtended.lastName;
        this.course = userExtended.course;
        this.institution = userExtended.institution;
        this.description = userExtended.description;
        this.email = userExtended.email;
        console.log(userExtended);

        //@ts-ignore
        this.http.get<ITask[]>(`/api/tasks?createdById.equals=${userExtended.id}`).subscribe((tasks: ITask[]) => {
          let filteredByCompleted = tasks.filter(task => task.completed == true);
          this.numTasks = filteredByCompleted.length;
          function sumTimeSpent(): void {
            //@ts-ignore
            this.http.get<IAfterStudy[]>('/api/after-studies').subscribe((Afterstudy: IAfterStudy[]) => {
              //@ts-ignore
              this.numHours = Afterstudy.reduce((sum, afterStudy) => sum + afterStudy.timeSpent, 0);
            });
          }
        });
        //@ts-ignore
        this.http.get<IUserExtended[]>(`/api/friends/by-userx/${userExtended.id}`).subscribe((friends: IUserExtended[]) => {
          // @ts-ignore
          this.numFriends = friends.length;
          console.log('friends ', friends);
        });

        this.http.get<ILeagueTable[]>(`/api/league-tables`).subscribe((leagueTables: ILeagueTable[]) => {
          for (let incompleteLeagueTable of leagueTables) {
            this.http.get<ILeagueTable>(`/api/league-tables/${incompleteLeagueTable.id}`).subscribe((completeLeagueTable: ILeagueTable) => {
              // @ts-ignore
              let leagueMembers = completeLeagueTable.members;
              let userInLeague = leagueMembers?.filter(member => member.id == userExtended.id);
              // @ts-ignore
              if (userInLeague.length == 1) this.numLeagues++;
            });
          }
        });

        this.http.get<IPost[]>(`/api/posts/`).subscribe((posts: IPost[]) => {
          this.numPosts = posts.filter(post => post.createdBy == user.login).length;
        });
      });
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
