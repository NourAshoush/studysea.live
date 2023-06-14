import dayjs from 'dayjs/esm';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';

export interface ITask {
  id: number;
  start?: dayjs.Dayjs | null;
  creation?: dayjs.Dayjs | null;
  title?: string | null;
  subject?: string | null;
  studyLength?: number | null;
  breakLength?: number | null;
  completed?: boolean | null;
  createdBy?: Pick<IUserExtended, 'id'> | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
