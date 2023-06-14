import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StudySessionComponent } from './list/study-session.component';
import { StudySessionDetailComponent } from './detail/study-session-detail.component';
import { StudySessionUpdateComponent } from './update/study-session-update.component';
import { StudySessionDeleteDialogComponent } from './delete/study-session-delete-dialog.component';
import { StudySessionRoutingModule } from './route/study-session-routing.module';

@NgModule({
  imports: [SharedModule, StudySessionRoutingModule],
  declarations: [StudySessionComponent, StudySessionDetailComponent, StudySessionUpdateComponent, StudySessionDeleteDialogComponent],
})
export class StudySessionModule {}
