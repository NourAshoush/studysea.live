import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeagueTableComponent } from '../list/league-table.component';
import { LeagueTableDetailComponent } from '../detail/league-table-detail.component';
import { LeagueTableUpdateComponent } from '../update/league-table-update.component';
import { LeagueTableRoutingResolveService } from './league-table-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const leagueTableRoute: Routes = [
  {
    path: '',
    component: LeagueTableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeagueTableDetailComponent,
    resolve: {
      leagueTable: LeagueTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeagueTableUpdateComponent,
    resolve: {
      leagueTable: LeagueTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeagueTableUpdateComponent,
    resolve: {
      leagueTable: LeagueTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leagueTableRoute)],
  exports: [RouterModule],
})
export class LeagueTableRoutingModule {}
