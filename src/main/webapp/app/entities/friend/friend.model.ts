import { IUserExtended } from 'app/entities/user-extended/user-extended.model';

export interface IFriend {
  id: number;
  friendshipFrom?: Pick<IUserExtended, 'id'> | null;
  friendshipTo?: Pick<IUserExtended, 'id'> | null;
}

export type NewFriend = Omit<IFriend, 'id'> & { id: null };
