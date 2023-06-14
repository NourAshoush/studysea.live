import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TaskFormService, TaskFormGroup } from './task-form.service';
import { ITask } from '../task.model';
import { TaskService } from '../service/task.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;

  userExtendedsSharedCollection: IUserExtended[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected userExtendedService: UserExtendedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserExtended = (o1: IUserExtended | null, o2: IUserExtended | null): boolean =>
    this.userExtendedService.compareUserExtended(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.userExtendedsSharedCollection = this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(
      this.userExtendedsSharedCollection,
      task.createdBy
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userExtendedService
      .query()
      .pipe(map((res: HttpResponse<IUserExtended[]>) => res.body ?? []))
      .pipe(
        map((userExtendeds: IUserExtended[]) =>
          this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(userExtendeds, this.task?.createdBy)
        )
      )
      .subscribe((userExtendeds: IUserExtended[]) => (this.userExtendedsSharedCollection = userExtendeds));
  }
}
