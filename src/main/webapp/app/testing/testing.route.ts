import { Route } from '@angular/router';

import { TestComponent } from './testing.component';

export const TEST_ROUTE: Route = {
  path: '',
  component: TestComponent,
  data: {
    pageTitle: 'page_titles.testing',
  },
};
