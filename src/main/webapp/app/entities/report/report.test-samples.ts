import dayjs from 'dayjs/esm';

import { IReport, NewReport } from './report.model';

export const sampleWithRequiredData: IReport = {
  id: 35851,
};

export const sampleWithPartialData: IReport = {
  id: 85044,
  contentType: 'payment compress',
  contentID: 'cross-platform mobile',
  reportedTime: dayjs('2023-04-17T21:05'),
};

export const sampleWithFullData: IReport = {
  id: 16686,
  contentType: 'e-business Account extensible',
  contentID: 'help-desk orange SMS',
  contentAuthor: 'Games',
  reportedBy: 'View Branding',
  reportedTime: dayjs('2023-04-18T11:06'),
  reportedReason: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewReport = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
