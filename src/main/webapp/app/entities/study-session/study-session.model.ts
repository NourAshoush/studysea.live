import dayjs from 'dayjs/esm';
import { ITask } from 'app/entities/task/task.model';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';

export interface IStudySession {
  id: number;
  actualStart?: dayjs.Dayjs | null;
  isPrivate?: boolean | null;
  task?: Pick<ITask, 'id'> | null;
  owner?: Pick<IUserExtended, 'id'> | null;
}

export type NewStudySession = Omit<IStudySession, 'id'> & { id: null };
