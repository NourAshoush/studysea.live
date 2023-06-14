import { IFriend, NewFriend } from './friend.model';

export const sampleWithRequiredData: IFriend = {
  id: 48784,
};

export const sampleWithPartialData: IFriend = {
  id: 44788,
};

export const sampleWithFullData: IFriend = {
  id: 53757,
};

export const sampleWithNewData: NewFriend = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
