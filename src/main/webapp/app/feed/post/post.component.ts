import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { IPost } from '../../entities/post/post.model';
import { IUser } from '../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})

/*
This is the component which actually displays each post.
It's also responsible for handling all necessary calculations such as:
calculating + displaying calculated time since the post, whether the user
had already like the post or not, and is the starting point of the emits
of the commenting and reporting modals
 */
export class PostComponent implements OnInit {
  @Input() post: IPost;
  @Output() viewPost = new EventEmitter<IPost>();
  @Output() deletePost = new EventEmitter<IPost>();
  @Output() reportPost = new EventEmitter<IPost>();
  isLiked: boolean = false;
  likedByList: string[];
  timeSince: string = '';
  numOfLikes: number | null | undefined = 0;
  numOfComments: number | null | undefined = 0;
  postBelongsToUser: boolean;
  @Input() username: string;

  constructor(public http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.numOfLikes = this.post.likes;
    this.findTimeSince();
    this.setIsLiked();
    // get the number of comments on a post
    this.http.get(`/api/comments/count?postID.equals=${this.post.id}`).subscribe(data => {
      // @ts-ignore
      this.numOfComments = data;
    });
    this.postBelongsToUser = this.username === this.post.createdBy;
  }

  /*
  This function inverts the boolean value of the isLiked variable.
  If it's true, the post is liked by the user, else it's not liked.
   */
  toggleLike() {
    if (!this.isLiked) {
      this.likePost();
    } else this.unlikePost();
  }

  /*
  This function checks whether the logged-in user has liked the post or not.
  It splits the likedBy post attribute by the delimiter and checks if the
  logged-in user's username occurs in that list or not. It then toggles the
  isLiked boolean variable accordingly.
   */
  setIsLiked() {
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // @ts-ignore
      this.username = data.login;
      // @ts-ignore
      this.likedByList = this.post.likedBy.split(',');
      this.isLiked = this.likedByList.includes(this.username);
      this.postBelongsToUser = this.username === this.post.createdBy;
    });
  }

  /*
  This function increments the number of likes by one and does a PUT http
  request with this updated like count, along with adding the logged-in
  user's username to the likedBy attribute with the delimiter. It then
  sets the isLiked variable to true to change the front-end.
  */
  likePost() {
    // @ts-ignore
    this.numOfLikes += 1;
    // @ts-ignore
    this.likedByList.push(this.username);
    let putBody = {
      id: this.post.id,
      createdBy: this.post.createdBy,
      creationTime: this.post.creationTime,
      title: this.post.title,
      description: this.post.description,
      likes: this.numOfLikes,
      likedBy: this.likedByList.join(','),
    };
    this.http.put<IPost>('/api/posts/' + this.post.id, putBody).subscribe();
    this.isLiked = true;

    this.post.likes = this.numOfLikes;
    this.post.likedBy = this.likedByList.join(',');
  }

  /*
  This function decrements the number of likes by one and does a PUT http
  request with this updated like count, along with removing the logged-in
  user's username from the likedBy attribute. It then sets the isLiked
  variable to false to change the front-end.
  */
  unlikePost() {
    // @ts-ignore
    this.numOfLikes -= 1;
    // @ts-ignore
    this.likedByList.splice(this.likedByList.indexOf(this.username), 1);
    let putBody = {
      id: this.post.id,
      createdBy: this.post.createdBy,
      creationTime: this.post.creationTime,
      title: this.post.title,
      description: this.post.description,
      likes: this.numOfLikes,
      likedBy: this.likedByList.join(','),
    };
    this.http.put<IPost>('/api/posts/' + this.post.id, putBody).subscribe();
    this.isLiked = false;

    this.post.likes = this.numOfLikes;
    this.post.likedBy = this.likedByList.join(',');
  }

  /*
  This function uses dayjs to calculate the difference between the current time
  and the time on a posts' creationTime attribute with the .diff function. It
  finds these differences in minutes, hours, and days, and then decides on what
  text to display on a post depending on the length of time that has passed.
   */
  findTimeSince() {
    const diffMinutes = dayjs().diff(this.post.creationTime, 'minutes');
    const diffHours = dayjs().diff(this.post.creationTime, 'hours');
    const diffDays = dayjs().diff(this.post.creationTime, 'days');

    if (diffMinutes < 60) {
      this.timeSince = diffMinutes === 0 ? 'Just Now' : diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      this.timeSince = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else {
      this.timeSince = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  }

  /*
  When the commenting button is pressed, this function button emits the current
  post object to the posts component where this post is embedded.
   */
  onView(): void {
    this.viewPost.emit(this.post);
  }

  onDelete(): void {
    this.deletePost.emit(this.post);
  }

  onReport(): void {
    this.reportPost.emit(this.post);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onView();
    } else if (event.key === 'l') {
      this.toggleLike();
    } else if (event.key === 'v') {
      this.onView();
    } else if (event.key === 'd' && this.postBelongsToUser) {
      this.onDelete();
    } else if (event.key == 'r' && !this.postBelongsToUser) {
      this.onReport();
    }
  }

  redirect() {
    if (window.location.pathname == '/feed') this.router.navigate(['/feed/see', this.post.id]);
    else window.history.back();
  }
}
