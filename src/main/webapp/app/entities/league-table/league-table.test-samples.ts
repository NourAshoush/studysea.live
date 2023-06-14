import { ILeagueTable, NewLeagueTable } from './league-table.model';

export const sampleWithRequiredData: ILeagueTable = {
  id: 61718,
};

export const sampleWithPartialData: ILeagueTable = {
  id: 83812,
  name: 'Account',
};

export const sampleWithFullData: ILeagueTable = {
  id: 30620,
  name: 'drive',
};

export const sampleWithNewData: NewLeagueTable = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
