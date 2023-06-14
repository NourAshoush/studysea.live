import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { BREAK_ROUTE } from './break.route';
import { BreakComponent } from './break.component';
import { UserListComponent } from '../shared/userList/userList.component';
import { ConfirmExitComponent } from './confirm-exit/confirm-exit.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([BREAK_ROUTE])],
  declarations: [BreakComponent, UserListComponent, ConfirmExitComponent],
})
export class BreakModule {}
