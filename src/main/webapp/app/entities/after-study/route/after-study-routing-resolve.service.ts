import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAfterStudy } from '../after-study.model';
import { AfterStudyService } from '../service/after-study.service';

@Injectable({ providedIn: 'root' })
export class AfterStudyRoutingResolveService implements Resolve<IAfterStudy | null> {
  constructor(protected service: AfterStudyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAfterStudy | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((afterStudy: HttpResponse<IAfterStudy>) => {
          if (afterStudy.body) {
            return of(afterStudy.body);
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
