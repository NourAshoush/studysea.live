import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AfterStudyComponent } from '../list/after-study.component';
import { AfterStudyDetailComponent } from '../detail/after-study-detail.component';
import { AfterStudyUpdateComponent } from '../update/after-study-update.component';
import { AfterStudyRoutingResolveService } from './after-study-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const afterStudyRoute: Routes = [
  {
    path: '',
    component: AfterStudyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AfterStudyDetailComponent,
    resolve: {
      afterStudy: AfterStudyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AfterStudyUpdateComponent,
    resolve: {
      afterStudy: AfterStudyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AfterStudyUpdateComponent,
    resolve: {
      afterStudy: AfterStudyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(afterStudyRoute)],
  exports: [RouterModule],
})
export class AfterStudyRoutingModule {}
