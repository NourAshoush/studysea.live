import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILeagueTable, NewLeagueTable } from '../league-table.model';

export type PartialUpdateLeagueTable = Partial<ILeagueTable> & Pick<ILeagueTable, 'id'>;

export type EntityResponseType = HttpResponse<ILeagueTable>;
export type EntityArrayResponseType = HttpResponse<ILeagueTable[]>;

@Injectable({ providedIn: 'root' })
export class LeagueTableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/league-tables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(leagueTable: NewLeagueTable): Observable<EntityResponseType> {
    return this.http.post<ILeagueTable>(this.resourceUrl, leagueTable, { observe: 'response' });
  }

  update(leagueTable: ILeagueTable): Observable<EntityResponseType> {
    return this.http.put<ILeagueTable>(`${this.resourceUrl}/${this.getLeagueTableIdentifier(leagueTable)}`, leagueTable, {
      observe: 'response',
    });
  }

  partialUpdate(leagueTable: PartialUpdateLeagueTable): Observable<EntityResponseType> {
    return this.http.patch<ILeagueTable>(`${this.resourceUrl}/${this.getLeagueTableIdentifier(leagueTable)}`, leagueTable, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILeagueTable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILeagueTable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLeagueTableIdentifier(leagueTable: Pick<ILeagueTable, 'id'>): number {
    return leagueTable.id;
  }

  compareLeagueTable(o1: Pick<ILeagueTable, 'id'> | null, o2: Pick<ILeagueTable, 'id'> | null): boolean {
    return o1 && o2 ? this.getLeagueTableIdentifier(o1) === this.getLeagueTableIdentifier(o2) : o1 === o2;
  }

  addLeagueTableToCollectionIfMissing<Type extends Pick<ILeagueTable, 'id'>>(
    leagueTableCollection: Type[],
    ...leagueTablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const leagueTables: Type[] = leagueTablesToCheck.filter(isPresent);
    if (leagueTables.length > 0) {
      const leagueTableCollectionIdentifiers = leagueTableCollection.map(
        leagueTableItem => this.getLeagueTableIdentifier(leagueTableItem)!
      );
      const leagueTablesToAdd = leagueTables.filter(leagueTableItem => {
        const leagueTableIdentifier = this.getLeagueTableIdentifier(leagueTableItem);
        if (leagueTableCollectionIdentifiers.includes(leagueTableIdentifier)) {
          return false;
        }
        leagueTableCollectionIdentifiers.push(leagueTableIdentifier);
        return true;
      });
      return [...leagueTablesToAdd, ...leagueTableCollection];
    }
    return leagueTableCollection;
  }
}
