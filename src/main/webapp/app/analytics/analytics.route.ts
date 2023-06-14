import { Route } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';

export const STUDY_ROUTE: Route = {
  path: '',
  component: AnalyticsComponent,
  data: {
    pageTitle: 'page_titles.analytics',
  },
};
