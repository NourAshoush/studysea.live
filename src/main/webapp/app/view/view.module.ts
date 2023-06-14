import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { VIEW_ROUTE } from './view.route';
import { ViewComponent } from './view.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { CreateLeagueComponent } from './create-league/create-league.component';
import { TaskComponent } from './task/task.component';
import { NewStudySessionComponent } from './new-study-session/new-study-session.component';
import { JoinStudySessionComponent } from '../shared/join-study-session/join-study-session.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([VIEW_ROUTE])],
  declarations: [
    ViewComponent,
    CreateTaskComponent,
    CreateLeagueComponent,
    TaskComponent,
    NewStudySessionComponent,
    JoinStudySessionComponent,
  ],
  exports: [JoinStudySessionComponent],
})
export class ViewModule {}
