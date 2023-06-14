import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserExtended, NewUserExtended } from '../user-extended.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserExtended for edit and NewUserExtendedFormGroupInput for create.
 */
type UserExtendedFormGroupInput = IUserExtended | PartialWithRequiredKeyOf<NewUserExtended>;

type UserExtendedFormDefaults = Pick<NewUserExtended, 'id' | 'privacy' | 'darkMode' | 'leagues'>;

type UserExtendedFormGroupContent = {
  id: FormControl<IUserExtended['id'] | NewUserExtended['id']>;
  firstName: FormControl<IUserExtended['firstName']>;
  lastName: FormControl<IUserExtended['lastName']>;
  email: FormControl<IUserExtended['email']>;
  status: FormControl<IUserExtended['status']>;
  institution: FormControl<IUserExtended['institution']>;
  course: FormControl<IUserExtended['course']>;
  description: FormControl<IUserExtended['description']>;
  privacy: FormControl<IUserExtended['privacy']>;
  darkMode: FormControl<IUserExtended['darkMode']>;
  user: FormControl<IUserExtended['user']>;
  studySession: FormControl<IUserExtended['studySession']>;
  leagues: FormControl<IUserExtended['leagues']>;
};

export type UserExtendedFormGroup = FormGroup<UserExtendedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserExtendedFormService {
  createUserExtendedFormGroup(userExtended: UserExtendedFormGroupInput = { id: null }): UserExtendedFormGroup {
    const userExtendedRawValue = {
      ...this.getFormDefaults(),
      ...userExtended,
    };
    return new FormGroup<UserExtendedFormGroupContent>({
      id: new FormControl(
        { value: userExtendedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(userExtendedRawValue.firstName),
      lastName: new FormControl(userExtendedRawValue.lastName),
      email: new FormControl(userExtendedRawValue.email),
      status: new FormControl(userExtendedRawValue.status),
      institution: new FormControl(userExtendedRawValue.institution),
      course: new FormControl(userExtendedRawValue.course),
      description: new FormControl(userExtendedRawValue.description),
      privacy: new FormControl(userExtendedRawValue.privacy),
      darkMode: new FormControl(userExtendedRawValue.darkMode),
      user: new FormControl(userExtendedRawValue.user),
      studySession: new FormControl(userExtendedRawValue.studySession),
      leagues: new FormControl(userExtendedRawValue.leagues ?? []),
    });
  }

  getUserExtended(form: UserExtendedFormGroup): IUserExtended | NewUserExtended {
    return form.getRawValue() as IUserExtended | NewUserExtended;
  }

  resetForm(form: UserExtendedFormGroup, userExtended: UserExtendedFormGroupInput): void {
    const userExtendedRawValue = { ...this.getFormDefaults(), ...userExtended };
    form.reset(
      {
        ...userExtendedRawValue,
        id: { value: userExtendedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserExtendedFormDefaults {
    return {
      id: null,
      privacy: false,
      darkMode: false,
      leagues: [],
    };
  }
}
