import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../../entities/post/post.model';
import { IUser } from '../../admin/user-management/user-management.model';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})

/*
all this component just gets all the posts to be displayed and passes them
onto the post component to format+display them
 */
export class PostsComponent implements OnInit {
  /*
  the viewPost variable here is receives a post emitted from either
  one of the post components it displays and emits/relays it to the
  feed component
  */
  posts: IPost[];
  @Output() viewPost = new EventEmitter<IPost>();
  @Output() deletePost = new EventEmitter<IPost>();
  @Output() reportPost = new EventEmitter<IPost>();
  username: string;
  @Input() filterBy: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // @ts-ignore
    this.http.get('/api/account').subscribe((user: IUser) => {
      // @ts-ignore
      this.username = user.login;

      // filter what posts the component gets
      if (this.filterBy === 'friends') {
        this.getFriendsPosts(user);
      } else if (this.filterBy === 'user') {
        this.getUsersPosts(user);
      } else if (this.filterBy === 'none') {
        this.getAllPosts();
      }
    });
  }

  // gets all posts and stores them in most recent first
  // this will be changed in the future to only show posts made by friends
  public getAllPosts() {
    // @ts-ignore
    this.http.get('/api/posts').subscribe((posts: IPost[]) => {
      this.sortPosts(posts);
    });
  }

  /*
  This one was a nightmare to figure out. But basically, this gets the logged-in user's
  details. It uses the user ID to find their UserExtended record. The use the UserExtended
  record to search for their friends, and finally, query the posts table based on the
  friend's usernames.
   */
  public getFriendsPosts(user: IUser) {
    // @ts-ignore
    this.http.get(`/api/user-extendeds/by-user/${user.id}`).subscribe((userExtended: IUserExtended) => {
      // @ts-ignore
      this.http.get(`/api/friends/by-userx/${userExtended.id}`).subscribe((friendsExtended: IUserExtended[]) => {
        // @ts-ignore
        let usersFriends: string[] = friendsExtended.map(aFriend => aFriend.user?.login); // extracts each username from the UserExtended objects
        usersFriends.push(this.username); // include users own posts on feed page
        let joinedFriends: string = usersFriends.join('%2C'); // joins all usernames into a string to pass into GET query
        // @ts-ignore
        this.http.get(`/api/posts?createdBy.in=${joinedFriends}`).subscribe((posts: IPost[]) => {
          this.sortPosts(posts);
        });
      });
    });
  }

  /*
  Works the same as getAllPosts(), but just filters with user's login
   */
  public getUsersPosts(user: IUser) {
    // @ts-ignore
    this.http.get(`/api/posts?createdBy.equals=${user.login}`).subscribe((posts: IPost[]) => {
      this.sortPosts(posts);
    });
  }

  public sortPosts(posts: IPost[]) {
    // Sort the posts array in ascending order based on the creationTime attribute
    this.posts = posts.sort((a, b) => {
      const timeA = dayjs(a.creationTime);
      const timeB = dayjs(b.creationTime);
      return timeA.isBefore(timeB) ? 1 : timeA.isAfter(timeB) ? -1 : 0;
    });
  }

  onViewPost(post: IPost) {
    this.viewPost.emit(post);
  }

  onDelete(post: IPost) {
    this.deletePost.emit(post);
  }

  onReport(post: IPost) {
    this.reportPost.emit(post);
  }
}
