import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FriendFormService, FriendFormGroup } from './friend-form.service';
import { IFriend } from '../friend.model';
import { FriendService } from '../service/friend.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

@Component({
  selector: 'jhi-friend-update',
  templateUrl: './friend-update.component.html',
})
export class FriendUpdateComponent implements OnInit {
  isSaving = false;
  friend: IFriend | null = null;

  userExtendedsSharedCollection: IUserExtended[] = [];

  editForm: FriendFormGroup = this.friendFormService.createFriendFormGroup();

  constructor(
    protected friendService: FriendService,
    protected friendFormService: FriendFormService,
    protected userExtendedService: UserExtendedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserExtended = (o1: IUserExtended | null, o2: IUserExtended | null): boolean =>
    this.userExtendedService.compareUserExtended(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ friend }) => {
      this.friend = friend;
      if (friend) {
        this.updateForm(friend);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const friend = this.friendFormService.getFriend(this.editForm);
    if (friend.id !== null) {
      this.subscribeToSaveResponse(this.friendService.update(friend));
    } else {
      this.subscribeToSaveResponse(this.friendService.create(friend));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFriend>>): void {
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

  protected updateForm(friend: IFriend): void {
    this.friend = friend;
    this.friendFormService.resetForm(this.editForm, friend);

    this.userExtendedsSharedCollection = this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(
      this.userExtendedsSharedCollection,
      friend.friendshipFrom,
      friend.friendshipTo
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userExtendedService
      .query()
      .pipe(map((res: HttpResponse<IUserExtended[]>) => res.body ?? []))
      .pipe(
        map((userExtendeds: IUserExtended[]) =>
          this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(
            userExtendeds,
            this.friend?.friendshipFrom,
            this.friend?.friendshipTo
          )
        )
      )
      .subscribe((userExtendeds: IUserExtended[]) => (this.userExtendedsSharedCollection = userExtendeds));
  }
}
