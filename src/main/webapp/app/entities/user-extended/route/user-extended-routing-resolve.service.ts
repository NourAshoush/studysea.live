import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserExtended } from '../user-extended.model';
import { UserExtendedService } from '../service/user-extended.service';

@Injectable({ providedIn: 'root' })
export class UserExtendedRoutingResolveService implements Resolve<IUserExtended | null> {
  constructor(protected service: UserExtendedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserExtended | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userExtended: HttpResponse<IUserExtended>) => {
          if (userExtended.body) {
            return of(userExtended.body);
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
