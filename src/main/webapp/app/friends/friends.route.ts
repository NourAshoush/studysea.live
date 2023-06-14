import { Route } from '@angular/router';

import { FriendsComponent } from './friends.component';
import { AddComponent } from './add/add.component';

export const FRIENDS_ROUTE: Route = {
  path: '',
  component: FriendsComponent,
  data: {
    pageTitle: 'global.menu.friends',
  },
};

export const ADD_FRIENDS_ROUTE: Route = {
  path: 'add/:id',
  component: AddComponent,
  data: {
    pageTitle: 'global.menu.add-friends',
  },
};
