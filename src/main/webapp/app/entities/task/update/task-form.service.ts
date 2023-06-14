import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITask, NewTask } from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITask for edit and NewTaskFormGroupInput for create.
 */
type TaskFormGroupInput = ITask | PartialWithRequiredKeyOf<NewTask>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITask | NewTask> = Omit<T, 'start' | 'creation'> & {
  start?: string | null;
  creation?: string | null;
};

type TaskFormRawValue = FormValueOf<ITask>;

type NewTaskFormRawValue = FormValueOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'id' | 'start' | 'creation' | 'completed'>;

type TaskFormGroupContent = {
  id: FormControl<TaskFormRawValue['id'] | NewTask['id']>;
  start: FormControl<TaskFormRawValue['start']>;
  creation: FormControl<TaskFormRawValue['creation']>;
  title: FormControl<TaskFormRawValue['title']>;
  subject: FormControl<TaskFormRawValue['subject']>;
  studyLength: FormControl<TaskFormRawValue['studyLength']>;
  breakLength: FormControl<TaskFormRawValue['breakLength']>;
  completed: FormControl<TaskFormRawValue['completed']>;
  createdBy: FormControl<TaskFormRawValue['createdBy']>;
};

export type TaskFormGroup = FormGroup<TaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskFormService {
  createTaskFormGroup(task: TaskFormGroupInput = { id: null }): TaskFormGroup {
    const taskRawValue = this.convertTaskToTaskRawValue({
      ...this.getFormDefaults(),
      ...task,
    });
    return new FormGroup<TaskFormGroupContent>({
      id: new FormControl(
        { value: taskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      start: new FormControl(taskRawValue.start),
      creation: new FormControl(taskRawValue.creation),
      title: new FormControl(taskRawValue.title),
      subject: new FormControl(taskRawValue.subject),
      studyLength: new FormControl(taskRawValue.studyLength),
      breakLength: new FormControl(taskRawValue.breakLength),
      completed: new FormControl(taskRawValue.completed),
      createdBy: new FormControl(taskRawValue.createdBy),
    });
  }

  getTask(form: TaskFormGroup): ITask | NewTask {
    return this.convertTaskRawValueToTask(form.getRawValue() as TaskFormRawValue | NewTaskFormRawValue);
  }

  resetForm(form: TaskFormGroup, task: TaskFormGroupInput): void {
    const taskRawValue = this.convertTaskToTaskRawValue({ ...this.getFormDefaults(), ...task });
    form.reset(
      {
        ...taskRawValue,
        id: { value: taskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TaskFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      start: currentTime,
      creation: currentTime,
      completed: false,
    };
  }

  private convertTaskRawValueToTask(rawTask: TaskFormRawValue | NewTaskFormRawValue): ITask | NewTask {
    return {
      ...rawTask,
      start: dayjs(rawTask.start, DATE_TIME_FORMAT),
      creation: dayjs(rawTask.creation, DATE_TIME_FORMAT),
    };
  }

  private convertTaskToTaskRawValue(
    task: ITask | (Partial<NewTask> & TaskFormDefaults)
  ): TaskFormRawValue | PartialWithRequiredKeyOf<NewTaskFormRawValue> {
    return {
      ...task,
      start: task.start ? task.start.format(DATE_TIME_FORMAT) : undefined,
      creation: task.creation ? task.creation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
