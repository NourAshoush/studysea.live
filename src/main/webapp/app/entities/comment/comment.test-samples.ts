import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
};

export const sampleWithPartialData: IComment = {
  id: 78272,
  author: 'Alabama Customer',
};

export const sampleWithFullData: IComment = {
  id: 42730,
  content: '../fake-data/blob/hipster.txt',
  author: 'disintermediate',
  postID: 'deposit Salad Investment',
  creationTime: dayjs('2023-04-08T06:40'),
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
