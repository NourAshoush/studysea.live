import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStudySession } from '../study-session.model';
import { StudySessionService } from '../service/study-session.service';

@Injectable({ providedIn: 'root' })
export class StudySessionRoutingResolveService implements Resolve<IStudySession | null> {
  constructor(protected service: StudySessionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStudySession | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((studySession: HttpResponse<IStudySession>) => {
          if (studySession.body) {
            return of(studySession.body);
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
