import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserExtended, NewUserExtended } from '../user-extended.model';

export type PartialUpdateUserExtended = Partial<IUserExtended> & Pick<IUserExtended, 'id'>;

export type EntityResponseType = HttpResponse<IUserExtended>;
export type EntityArrayResponseType = HttpResponse<IUserExtended[]>;

@Injectable({ providedIn: 'root' })
export class UserExtendedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-extendeds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userExtended: NewUserExtended): Observable<EntityResponseType> {
    return this.http.post<IUserExtended>(this.resourceUrl, userExtended, { observe: 'response' });
  }

  update(userExtended: IUserExtended): Observable<EntityResponseType> {
    return this.http.put<IUserExtended>(`${this.resourceUrl}/${this.getUserExtendedIdentifier(userExtended)}`, userExtended, {
      observe: 'response',
    });
  }

  partialUpdate(userExtended: PartialUpdateUserExtended): Observable<EntityResponseType> {
    return this.http.patch<IUserExtended>(`${this.resourceUrl}/${this.getUserExtendedIdentifier(userExtended)}`, userExtended, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserExtended>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBySessionId(id: number): Observable<IUserExtended[]> {
    return this.http.get<IUserExtended[]>(`${this.resourceUrl}/get-by-session/${id}`);
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserExtended[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserExtendedIdentifier(userExtended: Pick<IUserExtended, 'id'>): number {
    return userExtended.id;
  }

  compareUserExtended(o1: Pick<IUserExtended, 'id'> | null, o2: Pick<IUserExtended, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserExtendedIdentifier(o1) === this.getUserExtendedIdentifier(o2) : o1 === o2;
  }

  addUserExtendedToCollectionIfMissing<Type extends Pick<IUserExtended, 'id'>>(
    userExtendedCollection: Type[],
    ...userExtendedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userExtendeds: Type[] = userExtendedsToCheck.filter(isPresent);
    if (userExtendeds.length > 0) {
      const userExtendedCollectionIdentifiers = userExtendedCollection.map(
        userExtendedItem => this.getUserExtendedIdentifier(userExtendedItem)!
      );
      const userExtendedsToAdd = userExtendeds.filter(userExtendedItem => {
        const userExtendedIdentifier = this.getUserExtendedIdentifier(userExtendedItem);
        if (userExtendedCollectionIdentifiers.includes(userExtendedIdentifier)) {
          return false;
        }
        userExtendedCollectionIdentifiers.push(userExtendedIdentifier);
        return true;
      });
      return [...userExtendedsToAdd, ...userExtendedCollection];
    }
    return userExtendedCollection;
  }
}
