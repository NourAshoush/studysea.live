import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStudySession, NewStudySession } from '../study-session.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudySession for edit and NewStudySessionFormGroupInput for create.
 */
type StudySessionFormGroupInput = IStudySession | PartialWithRequiredKeyOf<NewStudySession>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStudySession | NewStudySession> = Omit<T, 'actualStart'> & {
  actualStart?: string | null;
};

type StudySessionFormRawValue = FormValueOf<IStudySession>;

type NewStudySessionFormRawValue = FormValueOf<NewStudySession>;

type StudySessionFormDefaults = Pick<NewStudySession, 'id' | 'actualStart' | 'isPrivate'>;

type StudySessionFormGroupContent = {
  id: FormControl<StudySessionFormRawValue['id'] | NewStudySession['id']>;
  actualStart: FormControl<StudySessionFormRawValue['actualStart']>;
  isPrivate: FormControl<StudySessionFormRawValue['isPrivate']>;
  task: FormControl<StudySessionFormRawValue['task']>;
  owner: FormControl<StudySessionFormRawValue['owner']>;
};

export type StudySessionFormGroup = FormGroup<StudySessionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudySessionFormService {
  createStudySessionFormGroup(studySession: StudySessionFormGroupInput = { id: null }): StudySessionFormGroup {
    const studySessionRawValue = this.convertStudySessionToStudySessionRawValue({
      ...this.getFormDefaults(),
      ...studySession,
    });
    return new FormGroup<StudySessionFormGroupContent>({
      id: new FormControl(
        { value: studySessionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      actualStart: new FormControl(studySessionRawValue.actualStart),
      isPrivate: new FormControl(studySessionRawValue.isPrivate),
      task: new FormControl(studySessionRawValue.task),
      owner: new FormControl(studySessionRawValue.owner),
    });
  }

  getStudySession(form: StudySessionFormGroup): IStudySession | NewStudySession {
    return this.convertStudySessionRawValueToStudySession(form.getRawValue() as StudySessionFormRawValue | NewStudySessionFormRawValue);
  }

  resetForm(form: StudySessionFormGroup, studySession: StudySessionFormGroupInput): void {
    const studySessionRawValue = this.convertStudySessionToStudySessionRawValue({ ...this.getFormDefaults(), ...studySession });
    form.reset(
      {
        ...studySessionRawValue,
        id: { value: studySessionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StudySessionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      actualStart: currentTime,
      isPrivate: false,
    };
  }

  private convertStudySessionRawValueToStudySession(
    rawStudySession: StudySessionFormRawValue | NewStudySessionFormRawValue
  ): IStudySession | NewStudySession {
    return {
      ...rawStudySession,
      actualStart: dayjs(rawStudySession.actualStart, DATE_TIME_FORMAT),
    };
  }

  private convertStudySessionToStudySessionRawValue(
    studySession: IStudySession | (Partial<NewStudySession> & StudySessionFormDefaults)
  ): StudySessionFormRawValue | PartialWithRequiredKeyOf<NewStudySessionFormRawValue> {
    return {
      ...studySession,
      actualStart: studySession.actualStart ? studySession.actualStart.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
