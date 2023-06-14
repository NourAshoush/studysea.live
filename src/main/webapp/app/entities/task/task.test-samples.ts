import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 37978,
};

export const sampleWithPartialData: ITask = {
  id: 23710,
  start: dayjs('2023-04-18T17:49'),
  creation: dayjs('2023-04-19T08:19'),
  studyLength: 5478,
  breakLength: 30677,
  completed: true,
};

export const sampleWithFullData: ITask = {
  id: 77015,
  start: dayjs('2023-04-18T23:22'),
  creation: dayjs('2023-04-18T16:17'),
  title: 'Granite TCP Table',
  subject: 'Virginia Dynamic attitude',
  studyLength: 1181,
  breakLength: 98513,
  completed: true,
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
