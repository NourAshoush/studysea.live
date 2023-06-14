import { Route } from '@angular/router';

import { PreStudyComponent } from './pre-study.component';

export const STUDY_ROUTE: Route = {
  path: '',
  component: PreStudyComponent,
  data: {
    pageTitle: 'page_titles.studying',
  },
};
