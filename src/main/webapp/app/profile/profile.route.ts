import { Route } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { ViewProfileComponent } from './view-profile/view-profile.component';

export const PROFILE_ROUTE: Route = {
  path: '',
  component: ProfileComponent,
  data: {
    pageTitle: 'global.menu.account.profile',
  },
  canActivate: [UserRouteAccessService],
};

export const VIEW_PROFILE_ROUTE: Route = {
  path: ':id',
  component: ViewProfileComponent,
  data: {
    pageTitle: 'global.menu.view-profile',
  },
};
