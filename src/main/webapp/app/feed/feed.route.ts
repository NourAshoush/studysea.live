import { Route } from '@angular/router';

import { FeedComponent } from './feed.component';
import { SeePostComponent } from './see-post/see-post.component';

export const FEED_ROUTE: Route = {
  path: '',
  component: FeedComponent,
  data: {
    pageTitle: 'page_titles.feed',
  },
};

export const SEE_POST_ROUTE: Route = {
  path: 'see/:id',
  component: SeePostComponent,
  data: {
    pageTitle: 'global.menu.see-post',
  },
};
