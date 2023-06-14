import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { TEST_ROUTE } from './testing.route';
import { TestComponent } from './testing.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([TEST_ROUTE])],
  declarations: [TestComponent],
})
export class TestingModule {}
