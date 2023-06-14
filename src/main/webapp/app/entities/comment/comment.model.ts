import dayjs from 'dayjs/esm';

export interface IComment {
  id: number;
  content?: string | null;
  author?: string | null;
  postID?: string | null;
  creationTime?: dayjs.Dayjs | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
