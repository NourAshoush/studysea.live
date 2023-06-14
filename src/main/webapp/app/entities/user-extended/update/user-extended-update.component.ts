import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserExtendedFormService, UserExtendedFormGroup } from './user-extended-form.service';
import { IUserExtended } from '../user-extended.model';
import { UserExtendedService } from '../service/user-extended.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IStudySession } from 'app/entities/study-session/study-session.model';
import { StudySessionService } from 'app/entities/study-session/service/study-session.service';

@Component({
  selector: 'jhi-user-extended-update',
  templateUrl: './user-extended-update.component.html',
})
export class UserExtendedUpdateComponent implements OnInit {
  isSaving = false;
  userExtended: IUserExtended | null = null;

  usersSharedCollection: IUser[] = [];
  studySessionsSharedCollection: IStudySession[] = [];

  editForm: UserExtendedFormGroup = this.userExtendedFormService.createUserExtendedFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userExtendedService: UserExtendedService,
    protected userExtendedFormService: UserExtendedFormService,
    protected userService: UserService,
    protected studySessionService: StudySessionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareStudySession = (o1: IStudySession | null, o2: IStudySession | null): boolean =>
    this.studySessionService.compareStudySession(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtended }) => {
      this.userExtended = userExtended;
      if (userExtended) {
        this.updateForm(userExtended);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userExtended = this.userExtendedFormService.getUserExtended(this.editForm);
    if (userExtended.id !== null) {
      this.subscribeToSaveResponse(this.userExtendedService.update(userExtended));
    } else {
      this.subscribeToSaveResponse(this.userExtendedService.create(userExtended));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserExtended>>): void {
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

  protected updateForm(userExtended: IUserExtended): void {
    this.userExtended = userExtended;
    this.userExtendedFormService.resetForm(this.editForm, userExtended);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userExtended.user);
    this.studySessionsSharedCollection = this.studySessionService.addStudySessionToCollectionIfMissing<IStudySession>(
      this.studySessionsSharedCollection,
      userExtended.studySession
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userExtended?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.studySessionService
      .query()
      .pipe(map((res: HttpResponse<IStudySession[]>) => res.body ?? []))
      .pipe(
        map((studySessions: IStudySession[]) =>
          this.studySessionService.addStudySessionToCollectionIfMissing<IStudySession>(studySessions, this.userExtended?.studySession)
        )
      )
      .subscribe((studySessions: IStudySession[]) => (this.studySessionsSharedCollection = studySessions));
  }
}
