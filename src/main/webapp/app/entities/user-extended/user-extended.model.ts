import { IUser } from 'app/entities/user/user.model';
import { IStudySession } from 'app/entities/study-session/study-session.model';
import { ILeagueTable } from 'app/entities/league-table/league-table.model';

export interface IUserExtended {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  status?: string | null;
  institution?: string | null;
  course?: string | null;
  description?: string | null;
  privacy?: boolean | null;
  darkMode?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  studySession?: Pick<IStudySession, 'id'> | null;
  leagues?: Pick<ILeagueTable, 'id'>[] | null;
}

export type NewUserExtended = Omit<IUserExtended, 'id'> & { id: null };
