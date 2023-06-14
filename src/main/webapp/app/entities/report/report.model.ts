import dayjs from 'dayjs/esm';

export interface IReport {
  id: number;
  contentType?: string | null;
  contentID?: string | null;
  contentAuthor?: string | null;
  reportedBy?: string | null;
  reportedTime?: dayjs.Dayjs | null;
  reportedReason?: string | null;
}

export type NewReport = Omit<IReport, 'id'> & { id: null };
