import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFriend } from '../friend.model';
import { FriendService } from '../service/friend.service';

@Injectable({ providedIn: 'root' })
export class FriendRoutingResolveService implements Resolve<IFriend | null> {
  constructor(protected service: FriendService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFriend | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((friend: HttpResponse<IFriend>) => {
          if (friend.body) {
            return of(friend.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
