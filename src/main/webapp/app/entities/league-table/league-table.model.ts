import { IUserExtended } from 'app/entities/user-extended/user-extended.model';

export interface ILeagueTable {
  id: number;
  name?: string | null;
  members?: Pick<IUserExtended, 'id'>[] | null;
}

export type NewLeagueTable = Omit<ILeagueTable, 'id'> & { id: null };
