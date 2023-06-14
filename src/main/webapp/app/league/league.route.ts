import { Route } from '@angular/router';

import { LeagueComponent } from './league.component';
import { JoinComponent } from './join/join.component';

export const LEAGUE_ROUTE: Route = {
  path: '',
  component: LeagueComponent,
  data: {
    // pageTitle: 'home.title',
    pageTitle: 'page_titles.league',
  },
};

export const JOIN_LEAGUE_ROUTE: Route = {
  path: 'join/:id',
  component: JoinComponent,
  data: {
    pageTitle: 'global.menu.join-league',
  },
};
