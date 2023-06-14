import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserExtendedComponent } from '../list/user-extended.component';
import { UserExtendedDetailComponent } from '../detail/user-extended-detail.component';
import { UserExtendedUpdateComponent } from '../update/user-extended-update.component';
import { UserExtendedRoutingResolveService } from './user-extended-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userExtendedRoute: Routes = [
  {
    path: '',
    component: UserExtendedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserExtendedDetailComponent,
    resolve: {
      userExtended: UserExtendedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserExtendedUpdateComponent,
    resolve: {
      userExtended: UserExtendedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserExtendedUpdateComponent,
    resolve: {
      userExtended: UserExtendedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userExtendedRoute)],
  exports: [RouterModule],
})
export class UserExtendedRoutingModule {}
