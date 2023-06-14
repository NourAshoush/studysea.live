import { Route } from '@angular/router';

import { ViewComponent } from './view.component';

export const VIEW_ROUTE: Route = {
  path: '',
  component: ViewComponent,
  data: {
    pageTitle: 'page_titles.studying',
  },
};
