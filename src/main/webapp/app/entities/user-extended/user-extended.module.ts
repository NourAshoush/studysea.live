import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserExtendedComponent } from './list/user-extended.component';
import { UserExtendedDetailComponent } from './detail/user-extended-detail.component';
import { UserExtendedUpdateComponent } from './update/user-extended-update.component';
import { UserExtendedDeleteDialogComponent } from './delete/user-extended-delete-dialog.component';
import { UserExtendedRoutingModule } from './route/user-extended-routing.module';

@NgModule({
  imports: [SharedModule, UserExtendedRoutingModule],
  declarations: [UserExtendedComponent, UserExtendedDetailComponent, UserExtendedUpdateComponent, UserExtendedDeleteDialogComponent],
})
export class UserExtendedModule {}
