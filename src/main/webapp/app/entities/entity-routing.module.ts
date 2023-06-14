import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from '../config/authority.constants';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'post',
        data: { pageTitle: 'teamprojectApp.post.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'user-extended',
        data: { pageTitle: 'teamprojectApp.userExtended.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./user-extended/user-extended.module').then(m => m.UserExtendedModule),
      },
      {
        path: 'friend',
        data: { pageTitle: 'teamprojectApp.friend.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./friend/friend.module').then(m => m.FriendModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'teamprojectApp.comment.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'report',
        data: { pageTitle: 'teamprojectApp.report.home.title' },
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
      },
      {
        path: 'league-table',
        data: { pageTitle: 'teamprojectApp.leagueTable.home.title' },
        loadChildren: () => import('./league-table/league-table.module').then(m => m.LeagueTableModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'teamprojectApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'after-study',
        data: { pageTitle: 'teamprojectApp.afterStudy.home.title' },
        loadChildren: () => import('./after-study/after-study.module').then(m => m.AfterStudyModule),
      },
      {
        path: 'study-session',
        data: { pageTitle: 'teamprojectApp.studySession.home.title' },
        loadChildren: () => import('./study-session/study-session.module').then(m => m.StudySessionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
