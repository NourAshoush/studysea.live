import { Component, OnInit } from '@angular/core';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks: ITask[] = [];
  private tasksSubscription: Subscription;

  constructor(private taskService: TaskService, private accountService: AccountService, private userExtendedService: UserExtendedService) {}

  private currentUserExtended: IUserExtended | null = null;

  fetchCurrentUserExtended(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userExtendedService.query().subscribe((res: HttpResponse<IUserExtended[]>) => {
          this.currentUserExtended = (res.body || []).find(userExtended => userExtended.user?.login === account.login) || null;
          this.loadTasks(); // Move the call to loadTasks() here
          console.log('tasks', this.tasks);
        });
      }
    });
  }

  ngOnInit(): void {
    this.fetchCurrentUserExtended();
  }

  loadTasks(): void {
    if (!this.currentUserExtended) {
      return;
    }

    this.tasksSubscription = this.taskService.query().subscribe((res: HttpResponse<ITask[]>) => {
      this.tasks = (res.body || []).filter(task => task.createdBy?.id === this.currentUserExtended?.id);
      console.log('tasks', this.tasks);
    });
  }
  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }
}
