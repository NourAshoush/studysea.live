import { Route } from '@angular/router';

import { BreakComponent } from './break.component';

export const BREAK_ROUTE: Route = {
  path: '',
  component: BreakComponent,
  data: {
    pageTitle: 'home.title',
  },
};
