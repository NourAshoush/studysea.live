import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { ITask } from '../../entities/task/task.model';
import { IAfterStudy } from '../../entities/after-study/after-study.model';
import { ILeagueTable } from '../../entities/league-table/league-table.model';
import { IPost } from '../../entities/post/post.model';
import { IUser } from '../../entities/user/user.model';

@Component({
  selector: 'jhi-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  userObj: any;
  userToViewUserEx: IUserExtended | null | undefined;
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
  showError: boolean = false;

  constructor(private route: ActivatedRoute, public http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // @ts-ignore
      this.http.get(`/api/users`).subscribe(users => {
        // @ts-ignore
        let filterUsers = users.filter(user => user.login == params['id']);
        if (filterUsers.length == 1) {
          let userToView = filterUsers[0];
          // @ts-ignore
          this.http.get(`/api/user-extendeds/by-user/${userToView.id}`).subscribe((userExtended: IUserExtended) => {
            this.userObj = userToView;
            this.userToViewUserEx = userExtended;
            if (this.userToViewUserEx != undefined) {
              this.initPage();
            } else {
              this.showError = true;
            }
          });
        } else this.showError = true;
      });
    });
  }

  // @ts-ignore
  initPage(): void {
    this.firstname = this.userToViewUserEx?.firstName;
    this.lastname = this.userToViewUserEx?.lastName;
    this.course = this.userToViewUserEx?.course;
    this.institution = this.userToViewUserEx?.institution;
    this.description = this.userToViewUserEx?.description;
    this.email = this.userToViewUserEx?.email;

    //@ts-ignore
    this.http.get<ITask[]>(`/api/tasks?createdById.equals=${this.userToViewUserEx.id}`).subscribe((tasks: ITask[]) => {
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
    this.http.get<IUserExtended[]>(`/api/friends/by-userx/${this.userToViewUserEx.id}`).subscribe((friends: IUserExtended[]) => {
      // @ts-ignore
      this.numFriends = friends.length;
    });

    this.http.get<ILeagueTable[]>(`/api/league-tables`).subscribe((leagueTables: ILeagueTable[]) => {
      for (let incompleteLeagueTable of leagueTables) {
        this.http.get<ILeagueTable>(`/api/league-tables/${incompleteLeagueTable.id}`).subscribe((completeLeagueTable: ILeagueTable) => {
          // @ts-ignore
          let leagueMembers = completeLeagueTable.members;
          let userInLeague = leagueMembers?.filter(member => member.id == this.userToViewUserEx?.id);
          // @ts-ignore
          if (userInLeague.length == 1) this.numLeagues++;
        });
      }
    });

    this.http.get<IPost[]>(`/api/posts/`).subscribe((posts: IPost[]) => {
      this.numPosts = posts.filter(post => post.createdBy == this.userObj.login).length;
    });
  }
}
