import { ITask } from 'app/entities/task/task.model';

export interface IAfterStudy {
  id: number;
  timeSpent?: string | null;
  task?: Pick<ITask, 'id'> | null;
}

export type NewAfterStudy = Omit<IAfterStudy, 'id'> & { id: null };
