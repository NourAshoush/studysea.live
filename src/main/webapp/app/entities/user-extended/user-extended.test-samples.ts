import { IUserExtended, NewUserExtended } from './user-extended.model';

export const sampleWithRequiredData: IUserExtended = {
  id: 94711,
};

export const sampleWithPartialData: IUserExtended = {
  id: 7120,
  firstName: 'Rosario',
  email: 'Laverne.Cummerata@yahoo.com',
  course: 'Regional',
  privacy: true,
  darkMode: true,
};

export const sampleWithFullData: IUserExtended = {
  id: 78585,
  firstName: 'Ahmad',
  lastName: 'Harvey',
  email: 'Jaquan28@hotmail.com',
  status: 'Rustic Eritrea Cambridgeshire',
  institution: 'Unbranded Handcrafted',
  course: 'standardization Directives',
  description: '../fake-data/blob/hipster.txt',
  privacy: true,
  darkMode: false,
};

export const sampleWithNewData: NewUserExtended = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
