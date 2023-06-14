import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StudySessionFormService, StudySessionFormGroup } from './study-session-form.service';
import { IStudySession } from '../study-session.model';
import { StudySessionService } from '../service/study-session.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

@Component({
  selector: 'jhi-study-session-update',
  templateUrl: './study-session-update.component.html',
})
export class StudySessionUpdateComponent implements OnInit {
  isSaving = false;
  studySession: IStudySession | null = null;

  tasksSharedCollection: ITask[] = [];
  userExtendedsSharedCollection: IUserExtended[] = [];

  editForm: StudySessionFormGroup = this.studySessionFormService.createStudySessionFormGroup();

  constructor(
    protected studySessionService: StudySessionService,
    protected studySessionFormService: StudySessionFormService,
    protected taskService: TaskService,
    protected userExtendedService: UserExtendedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  compareUserExtended = (o1: IUserExtended | null, o2: IUserExtended | null): boolean =>
    this.userExtendedService.compareUserExtended(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studySession }) => {
      this.studySession = studySession;
      if (studySession) {
        this.updateForm(studySession);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const studySession = this.studySessionFormService.getStudySession(this.editForm);
    if (studySession.id !== null) {
      this.subscribeToSaveResponse(this.studySessionService.update(studySession));
    } else {
      this.subscribeToSaveResponse(this.studySessionService.create(studySession));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudySession>>): void {
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

  protected updateForm(studySession: IStudySession): void {
    this.studySession = studySession;
    this.studySessionFormService.resetForm(this.editForm, studySession);

    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, studySession.task);
    this.userExtendedsSharedCollection = this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(
      this.userExtendedsSharedCollection,
      studySession.owner
    );
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, this.studySession?.task)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.userExtendedService
      .query()
      .pipe(map((res: HttpResponse<IUserExtended[]>) => res.body ?? []))
      .pipe(
        map((userExtendeds: IUserExtended[]) =>
          this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(userExtendeds, this.studySession?.owner)
        )
      )
      .subscribe((userExtendeds: IUserExtended[]) => (this.userExtendedsSharedCollection = userExtendeds));
  }
}
