import dayjs from 'dayjs/esm';

export interface IPost {
  id: number;
  createdBy?: string | null;
  creationTime?: dayjs.Dayjs | null;
  title?: string | null;
  description?: string | null;
  likes?: number | null;
  likedBy?: string | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
