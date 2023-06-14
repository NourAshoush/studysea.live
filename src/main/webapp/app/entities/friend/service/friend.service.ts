import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFriend, NewFriend } from '../friend.model';

export type PartialUpdateFriend = Partial<IFriend> & Pick<IFriend, 'id'>;

export type EntityResponseType = HttpResponse<IFriend>;
export type EntityArrayResponseType = HttpResponse<IFriend[]>;

@Injectable({ providedIn: 'root' })
export class FriendService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/friends');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(friend: NewFriend): Observable<EntityResponseType> {
    return this.http.post<IFriend>(this.resourceUrl, friend, { observe: 'response' });
  }

  update(friend: IFriend): Observable<EntityResponseType> {
    return this.http.put<IFriend>(`${this.resourceUrl}/${this.getFriendIdentifier(friend)}`, friend, { observe: 'response' });
  }

  partialUpdate(friend: PartialUpdateFriend): Observable<EntityResponseType> {
    return this.http.patch<IFriend>(`${this.resourceUrl}/${this.getFriendIdentifier(friend)}`, friend, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFriend>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFriend[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFriendIdentifier(friend: Pick<IFriend, 'id'>): number {
    return friend.id;
  }

  compareFriend(o1: Pick<IFriend, 'id'> | null, o2: Pick<IFriend, 'id'> | null): boolean {
    return o1 && o2 ? this.getFriendIdentifier(o1) === this.getFriendIdentifier(o2) : o1 === o2;
  }

  addFriendToCollectionIfMissing<Type extends Pick<IFriend, 'id'>>(
    friendCollection: Type[],
    ...friendsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const friends: Type[] = friendsToCheck.filter(isPresent);
    if (friends.length > 0) {
      const friendCollectionIdentifiers = friendCollection.map(friendItem => this.getFriendIdentifier(friendItem)!);
      const friendsToAdd = friends.filter(friendItem => {
        const friendIdentifier = this.getFriendIdentifier(friendItem);
        if (friendCollectionIdentifiers.includes(friendIdentifier)) {
          return false;
        }
        friendCollectionIdentifiers.push(friendIdentifier);
        return true;
      });
      return [...friendsToAdd, ...friendCollection];
    }
    return friendCollection;
  }
}
