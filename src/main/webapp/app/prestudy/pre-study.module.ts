import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { STUDY_ROUTE } from './prestudy.route';
import { PreStudyComponent } from './pre-study.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([STUDY_ROUTE])],
  declarations: [PreStudyComponent],
})
export class PreStudyModule {}
