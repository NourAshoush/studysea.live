import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAfterStudy, NewAfterStudy } from '../after-study.model';

export type PartialUpdateAfterStudy = Partial<IAfterStudy> & Pick<IAfterStudy, 'id'>;

export type EntityResponseType = HttpResponse<IAfterStudy>;
export type EntityArrayResponseType = HttpResponse<IAfterStudy[]>;

@Injectable({ providedIn: 'root' })
export class AfterStudyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/after-studies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(afterStudy: NewAfterStudy): Observable<EntityResponseType> {
    return this.http.post<IAfterStudy>(this.resourceUrl, afterStudy, { observe: 'response' });
  }

  update(afterStudy: IAfterStudy): Observable<EntityResponseType> {
    return this.http.put<IAfterStudy>(`${this.resourceUrl}/${this.getAfterStudyIdentifier(afterStudy)}`, afterStudy, {
      observe: 'response',
    });
  }

  partialUpdate(afterStudy: PartialUpdateAfterStudy): Observable<EntityResponseType> {
    return this.http.patch<IAfterStudy>(`${this.resourceUrl}/${this.getAfterStudyIdentifier(afterStudy)}`, afterStudy, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAfterStudy>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAfterStudy[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAfterStudyIdentifier(afterStudy: Pick<IAfterStudy, 'id'>): number {
    return afterStudy.id;
  }

  compareAfterStudy(o1: Pick<IAfterStudy, 'id'> | null, o2: Pick<IAfterStudy, 'id'> | null): boolean {
    return o1 && o2 ? this.getAfterStudyIdentifier(o1) === this.getAfterStudyIdentifier(o2) : o1 === o2;
  }

  addAfterStudyToCollectionIfMissing<Type extends Pick<IAfterStudy, 'id'>>(
    afterStudyCollection: Type[],
    ...afterStudiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const afterStudies: Type[] = afterStudiesToCheck.filter(isPresent);
    if (afterStudies.length > 0) {
      const afterStudyCollectionIdentifiers = afterStudyCollection.map(afterStudyItem => this.getAfterStudyIdentifier(afterStudyItem)!);
      const afterStudiesToAdd = afterStudies.filter(afterStudyItem => {
        const afterStudyIdentifier = this.getAfterStudyIdentifier(afterStudyItem);
        if (afterStudyCollectionIdentifiers.includes(afterStudyIdentifier)) {
          return false;
        }
        afterStudyCollectionIdentifiers.push(afterStudyIdentifier);
        return true;
      });
      return [...afterStudiesToAdd, ...afterStudyCollection];
    }
    return afterStudyCollection;
  }
}
