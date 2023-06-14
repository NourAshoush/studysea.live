import dayjs from 'dayjs/esm';

import { IStudySession, NewStudySession } from './study-session.model';

export const sampleWithRequiredData: IStudySession = {
  id: 3695,
};

export const sampleWithPartialData: IStudySession = {
  id: 35573,
  actualStart: dayjs('2023-04-19T11:13'),
};

export const sampleWithFullData: IStudySession = {
  id: 17256,
  actualStart: dayjs('2023-04-19T04:27'),
  isPrivate: true,
};

export const sampleWithNewData: NewStudySession = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
