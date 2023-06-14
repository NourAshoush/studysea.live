import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { STUDY_ROUTE } from './analytics.route';
import { AnalyticsComponent } from './analytics.component';
import { DonutChartComponent } from './graphs/donut-chart/donut-chart.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskComponent } from './task/task.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([STUDY_ROUTE])],
  declarations: [AnalyticsComponent, DonutChartComponent, TasksComponent, TaskComponent],
})
export class AnalyticsModule {}
