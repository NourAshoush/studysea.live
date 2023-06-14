import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AfterStudyComponent } from './list/after-study.component';
import { AfterStudyDetailComponent } from './detail/after-study-detail.component';
import { AfterStudyUpdateComponent } from './update/after-study-update.component';
import { AfterStudyDeleteDialogComponent } from './delete/after-study-delete-dialog.component';
import { AfterStudyRoutingModule } from './route/after-study-routing.module';

@NgModule({
  imports: [SharedModule, AfterStudyRoutingModule],
  declarations: [AfterStudyComponent, AfterStudyDetailComponent, AfterStudyUpdateComponent, AfterStudyDeleteDialogComponent],
})
export class AfterStudyModule {}
