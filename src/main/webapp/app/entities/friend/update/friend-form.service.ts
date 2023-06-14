import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFriend, NewFriend } from '../friend.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFriend for edit and NewFriendFormGroupInput for create.
 */
type FriendFormGroupInput = IFriend | PartialWithRequiredKeyOf<NewFriend>;

type FriendFormDefaults = Pick<NewFriend, 'id'>;

type FriendFormGroupContent = {
  id: FormControl<IFriend['id'] | NewFriend['id']>;
  friendshipFrom: FormControl<IFriend['friendshipFrom']>;
  friendshipTo: FormControl<IFriend['friendshipTo']>;
};

export type FriendFormGroup = FormGroup<FriendFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FriendFormService {
  createFriendFormGroup(friend: FriendFormGroupInput = { id: null }): FriendFormGroup {
    const friendRawValue = {
      ...this.getFormDefaults(),
      ...friend,
    };
    return new FormGroup<FriendFormGroupContent>({
      id: new FormControl(
        { value: friendRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      friendshipFrom: new FormControl(friendRawValue.friendshipFrom),
      friendshipTo: new FormControl(friendRawValue.friendshipTo),
    });
  }

  getFriend(form: FriendFormGroup): IFriend | NewFriend {
    return form.getRawValue() as IFriend | NewFriend;
  }

  resetForm(form: FriendFormGroup, friend: FriendFormGroupInput): void {
    const friendRawValue = { ...this.getFormDefaults(), ...friend };
    form.reset(
      {
        ...friendRawValue,
        id: { value: friendRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FriendFormDefaults {
    return {
      id: null,
    };
  }
}
