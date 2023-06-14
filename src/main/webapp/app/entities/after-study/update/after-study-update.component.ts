import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AfterStudyFormService, AfterStudyFormGroup } from './after-study-form.service';
import { IAfterStudy } from '../after-study.model';
import { AfterStudyService } from '../service/after-study.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

@Component({
  selector: 'jhi-after-study-update',
  templateUrl: './after-study-update.component.html',
})
export class AfterStudyUpdateComponent implements OnInit {
  isSaving = false;
  afterStudy: IAfterStudy | null = null;

  tasksSharedCollection: ITask[] = [];

  editForm: AfterStudyFormGroup = this.afterStudyFormService.createAfterStudyFormGroup();

  constructor(
    protected afterStudyService: AfterStudyService,
    protected afterStudyFormService: AfterStudyFormService,
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ afterStudy }) => {
      this.afterStudy = afterStudy;
      if (afterStudy) {
        this.updateForm(afterStudy);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const afterStudy = this.afterStudyFormService.getAfterStudy(this.editForm);
    if (afterStudy.id !== null) {
      this.subscribeToSaveResponse(this.afterStudyService.update(afterStudy));
    } else {
      this.subscribeToSaveResponse(this.afterStudyService.create(afterStudy));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAfterStudy>>): void {
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

  protected updateForm(afterStudy: IAfterStudy): void {
    this.afterStudy = afterStudy;
    this.afterStudyFormService.resetForm(this.editForm, afterStudy);

    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, afterStudy.task);
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, this.afterStudy?.task)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));
  }
}
