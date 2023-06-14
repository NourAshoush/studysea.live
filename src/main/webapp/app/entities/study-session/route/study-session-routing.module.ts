import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StudySessionComponent } from '../list/study-session.component';
import { StudySessionDetailComponent } from '../detail/study-session-detail.component';
import { StudySessionUpdateComponent } from '../update/study-session-update.component';
import { StudySessionRoutingResolveService } from './study-session-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const studySessionRoute: Routes = [
  {
    path: '',
    component: StudySessionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudySessionDetailComponent,
    resolve: {
      studySession: StudySessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudySessionUpdateComponent,
    resolve: {
      studySession: StudySessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudySessionUpdateComponent,
    resolve: {
      studySession: StudySessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(studySessionRoute)],
  exports: [RouterModule],
})
export class StudySessionRoutingModule {}
