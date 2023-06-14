import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { FEED_ROUTE, SEE_POST_ROUTE } from './feed.route';
import { FeedComponent } from './feed.component';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { CommentComponent } from './comment/comment.component';
import { DeletePostOrCommentComponent } from './delete-post-or-comment/delete-post-or-comment.component';
import { ReportComponent } from './report/report.component';
import { SeePostComponent } from './see-post/see-post.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([FEED_ROUTE, SEE_POST_ROUTE])],
  declarations: [
    FeedComponent,
    PostComponent,
    PostsComponent,
    CreatePostComponent,
    ViewPostComponent,
    CommentComponent,
    DeletePostOrCommentComponent,
    ReportComponent,
    SeePostComponent,
  ],
})
export class FeedModule {}
