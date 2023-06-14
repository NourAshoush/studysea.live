import { IAfterStudy, NewAfterStudy } from './after-study.model';

export const sampleWithRequiredData: IAfterStudy = {
  id: 88864,
};

export const sampleWithPartialData: IAfterStudy = {
  id: 68042,
  timeSpent: '53423',
};

export const sampleWithFullData: IAfterStudy = {
  id: 29472,
  timeSpent: '70878',
};

export const sampleWithNewData: NewAfterStudy = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
