import { Route } from '@angular/router';

import { PostStudyComponent } from './post-study.component';

export const STUDY_ROUTE: Route = {
  path: '',
  component: PostStudyComponent,
  data: {
    pageTitle: 'page_titles.studying',
  },
};
