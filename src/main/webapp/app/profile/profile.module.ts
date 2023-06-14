import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PROFILE_ROUTE, VIEW_PROFILE_ROUTE } from './profile.route';
import { ProfileComponent } from './profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

@NgModule({
  declarations: [ProfileComponent, ViewProfileComponent],
  imports: [CommonModule, RouterModule.forChild([PROFILE_ROUTE, VIEW_PROFILE_ROUTE]), SharedModule],
})
export class ProfileModule {}
