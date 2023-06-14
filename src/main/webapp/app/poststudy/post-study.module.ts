import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { STUDY_ROUTE } from './poststudy';
import { PostStudyComponent } from './post-study.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([STUDY_ROUTE])],
  declarations: [PostStudyComponent],
})
export class PostStudyModule {}
