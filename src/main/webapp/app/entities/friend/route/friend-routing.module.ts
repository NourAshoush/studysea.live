import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FriendComponent } from '../list/friend.component';
import { FriendDetailComponent } from '../detail/friend-detail.component';
import { FriendUpdateComponent } from '../update/friend-update.component';
import { FriendRoutingResolveService } from './friend-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const friendRoute: Routes = [
  {
    path: '',
    component: FriendComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FriendDetailComponent,
    resolve: {
      friend: FriendRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FriendUpdateComponent,
    resolve: {
      friend: FriendRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FriendUpdateComponent,
    resolve: {
      friend: FriendRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(friendRoute)],
  exports: [RouterModule],
})
export class FriendRoutingModule {}
