import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
};

export const sampleWithPartialData: IPost = {
  id: 798,
  likes: 54350,
  likedBy: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IPost = {
  id: 79841,
  createdBy: 'Future recontextualize',
  creationTime: dayjs('2023-03-09T18:55'),
  title: 'Refined',
  description: '../fake-data/blob/hipster.txt',
  likes: 49024,
  likedBy: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewPost = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
