import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudySession, NewStudySession } from '../study-session.model';

export type PartialUpdateStudySession = Partial<IStudySession> & Pick<IStudySession, 'id'>;

type RestOf<T extends IStudySession | NewStudySession> = Omit<T, 'actualStart'> & {
  actualStart?: string | null;
};

export type RestStudySession = RestOf<IStudySession>;

export type NewRestStudySession = RestOf<NewStudySession>;

export type PartialUpdateRestStudySession = RestOf<PartialUpdateStudySession>;

export type EntityResponseType = HttpResponse<IStudySession>;
export type EntityArrayResponseType = HttpResponse<IStudySession[]>;

@Injectable({ providedIn: 'root' })
export class StudySessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/study-sessions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(studySession: NewStudySession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studySession);
    return this.http
      .post<RestStudySession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(studySession: IStudySession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studySession);
    return this.http
      .put<RestStudySession>(`${this.resourceUrl}/${this.getStudySessionIdentifier(studySession)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(studySession: PartialUpdateStudySession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studySession);
    return this.http
      .patch<RestStudySession>(`${this.resourceUrl}/${this.getStudySessionIdentifier(studySession)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStudySession>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStudySession[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStudySessionIdentifier(studySession: Pick<IStudySession, 'id'>): number {
    return studySession.id;
  }

  compareStudySession(o1: Pick<IStudySession, 'id'> | null, o2: Pick<IStudySession, 'id'> | null): boolean {
    return o1 && o2 ? this.getStudySessionIdentifier(o1) === this.getStudySessionIdentifier(o2) : o1 === o2;
  }

  addStudySessionToCollectionIfMissing<Type extends Pick<IStudySession, 'id'>>(
    studySessionCollection: Type[],
    ...studySessionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const studySessions: Type[] = studySessionsToCheck.filter(isPresent);
    if (studySessions.length > 0) {
      const studySessionCollectionIdentifiers = studySessionCollection.map(
        studySessionItem => this.getStudySessionIdentifier(studySessionItem)!
      );
      const studySessionsToAdd = studySessions.filter(studySessionItem => {
        const studySessionIdentifier = this.getStudySessionIdentifier(studySessionItem);
        if (studySessionCollectionIdentifiers.includes(studySessionIdentifier)) {
          return false;
        }
        studySessionCollectionIdentifiers.push(studySessionIdentifier);
        return true;
      });
      return [...studySessionsToAdd, ...studySessionCollection];
    }
    return studySessionCollection;
  }

  getPublicSession(): Observable<IStudySession[]> {
    return this.http.get<IStudySession[]>(`${this.resourceUrl}/getPublic`);
  }

  getFriendSession(): Observable<IStudySession> {
    return this.http.get<IStudySession>(`${this.resourceUrl}/getFriends`);
  }

  protected convertDateFromClient<T extends IStudySession | NewStudySession | PartialUpdateStudySession>(studySession: T): RestOf<T> {
    return {
      ...studySession,
      actualStart: studySession.actualStart?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restStudySession: RestStudySession): IStudySession {
    return {
      ...restStudySession,
      actualStart: restStudySession.actualStart ? dayjs(restStudySession.actualStart) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStudySession>): HttpResponse<IStudySession> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStudySession[]>): HttpResponse<IStudySession[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
