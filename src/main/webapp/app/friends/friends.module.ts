import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ADD_FRIENDS_ROUTE, FRIENDS_ROUTE } from './friends.route';
import { FriendsComponent } from './friends.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([FRIENDS_ROUTE, ADD_FRIENDS_ROUTE])],
  declarations: [FriendsComponent, AddComponent],
})
export class FriendsModule {}
