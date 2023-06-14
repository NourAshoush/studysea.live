import { Route } from '@angular/router';

import { StudyComponent } from './study.component';

export const STUDY_ROUTE: Route = {
  path: '',
  component: StudyComponent,
  data: {
    pageTitle: 'page_titles.studying',
  },
};
