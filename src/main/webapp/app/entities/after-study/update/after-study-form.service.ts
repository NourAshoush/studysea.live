import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAfterStudy, NewAfterStudy } from '../after-study.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAfterStudy for edit and NewAfterStudyFormGroupInput for create.
 */
type AfterStudyFormGroupInput = IAfterStudy | PartialWithRequiredKeyOf<NewAfterStudy>;

type AfterStudyFormDefaults = Pick<NewAfterStudy, 'id'>;

type AfterStudyFormGroupContent = {
  id: FormControl<IAfterStudy['id'] | NewAfterStudy['id']>;
  timeSpent: FormControl<IAfterStudy['timeSpent']>;
  task: FormControl<IAfterStudy['task']>;
};

export type AfterStudyFormGroup = FormGroup<AfterStudyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AfterStudyFormService {
  createAfterStudyFormGroup(afterStudy: AfterStudyFormGroupInput = { id: null }): AfterStudyFormGroup {
    const afterStudyRawValue = {
      ...this.getFormDefaults(),
      ...afterStudy,
    };
    return new FormGroup<AfterStudyFormGroupContent>({
      id: new FormControl(
        { value: afterStudyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      timeSpent: new FormControl(afterStudyRawValue.timeSpent),
      task: new FormControl(afterStudyRawValue.task),
    });
  }

  getAfterStudy(form: AfterStudyFormGroup): IAfterStudy | NewAfterStudy {
    return form.getRawValue() as IAfterStudy | NewAfterStudy;
  }

  resetForm(form: AfterStudyFormGroup, afterStudy: AfterStudyFormGroupInput): void {
    const afterStudyRawValue = { ...this.getFormDefaults(), ...afterStudy };
    form.reset(
      {
        ...afterStudyRawValue,
        id: { value: afterStudyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AfterStudyFormDefaults {
    return {
      id: null,
    };
  }
}
