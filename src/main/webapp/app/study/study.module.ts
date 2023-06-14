import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { STUDY_ROUTE } from './study.route';
import { StudyComponent } from './study.component';
import { ConfirmExitStudyComponent } from './confirm-exit-study/confirm-exit-study.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([STUDY_ROUTE])],
  declarations: [StudyComponent, ConfirmExitStudyComponent],
})
export class StudyModule {}
