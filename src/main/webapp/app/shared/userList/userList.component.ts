import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserListService } from '../userList.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { ChatService } from '../chat.service';
import { ITask } from '../../entities/task/task.model';
import { StudyRoomService } from '../study-room.service';
import { ModalService } from '../modal/modal.service';
import { AnimateService } from '../bg-animation/animate.service';

@Component({
  selector: 'jhi-user-list',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  me: IUserExtended;
  myUsers: IUserExtended[];

  myTask: ITask;
  timeSpentStudying: number;
  breakBlocksCompleted: number;
  studyBlocksCompleted: number;

  email: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private userListService: UserListService,
    private http: HttpClient,
    public chatService: ChatService,
    public roomService: StudyRoomService,
    public modalService: ModalService,
    public animate: AnimateService
  ) {}

  toggleAnimation(): void {
    this.animate.disabled = !this.animate.disabled;
  }

  calculateHue(userX: IUserExtended): string {
    let hash = 0;
    // console.log("username", userX.user?.login);
    const str = String(userX.user?.login);
    if (str.length === 0) {
      return hash.toString() + 'deg';
    }
    for (let i = 0; i < str.length; i++) {
      // eslint-disable-next-line no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      // eslint-disable-next-line no-bitwise
      hash = hash & hash;
    }
    // console.log('as calculated by userList component', (hash % 360).toString() + 'deg');
    return (hash % 360).toString() + 'deg';
  }

  getTaskInfo(): void {
    if (this.roomService.myTask != null && typeof this.roomService.myTask !== 'undefined') {
      this.myTask = this.roomService.myTask;
      this.timeSpentStudying = Math.floor(this.roomService.timeSpentStudying / 60);
      this.breakBlocksCompleted = this.roomService.breakBlocksCompleted;
      this.studyBlocksCompleted = this.roomService.studyBlocksCompleted;
    }
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const accountId: number = account['id'];
        this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
          this.me = data;
          this.getTaskInfo();
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
