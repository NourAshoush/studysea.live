import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILeagueTable } from '../league-table.model';
import { LeagueTableService } from '../service/league-table.service';

@Injectable({ providedIn: 'root' })
export class LeagueTableRoutingResolveService implements Resolve<ILeagueTable | null> {
  constructor(protected service: LeagueTableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeagueTable | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((leagueTable: HttpResponse<ILeagueTable>) => {
          if (leagueTable.body) {
            return of(leagueTable.body);
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
