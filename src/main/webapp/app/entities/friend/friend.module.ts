import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FriendComponent } from './list/friend.component';
import { FriendDetailComponent } from './detail/friend-detail.component';
import { FriendUpdateComponent } from './update/friend-update.component';
import { FriendDeleteDialogComponent } from './delete/friend-delete-dialog.component';
import { FriendRoutingModule } from './route/friend-routing.module';

@NgModule({
  imports: [SharedModule, FriendRoutingModule],
  declarations: [FriendComponent, FriendDetailComponent, FriendUpdateComponent, FriendDeleteDialogComponent],
})
export class FriendModule {}
