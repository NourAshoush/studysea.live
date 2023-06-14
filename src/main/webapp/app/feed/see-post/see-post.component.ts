import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { IPost } from '../../entities/post/post.model';
import { IUser } from '../../admin/user-management/user-management.model';
import dayjs from 'dayjs';
import { IComment } from '../../entities/comment/comment.model';
import { ModalService } from '../../shared/modal/modal.service';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';

@Component({
  selector: 'jhi-see-post',
  templateUrl: './see-post.component.html',
  styleUrls: ['./see-post.component.scss'],
})
export class SeePostComponent implements OnInit {
  postID: string;
  post: IPost;
  postBelongsTo: string;
  comments: IComment[];
  showPost: boolean = true;
  user: IUser;
  username: string;
  commentInput: string = '';
  commentProvidedCondition: boolean = false;
  contentToDelete: IPost | IComment;
  contentToReport: IPost | IComment;

  constructor(private route: ActivatedRoute, public http: HttpClient, public modalService: ModalService) {}

  ngOnInit() {
    // @ts-ignore
    this.http.get('/api/account').subscribe((user: IUser) => {
      // @ts-ignore
      this.username = user.login;
      this.user = user;
    });

    this.route.params.subscribe(params => {
      this.postID = params['id'];

      if (this.isValid(this.postID)) {
        this.postExists(this.postID).subscribe((exists: boolean) => {
          if (exists) {
            // @ts-ignore
            this.http.get(`/api/user-extendeds/by-user/${this.user.id}`).subscribe((userExtended: IUserExtended) => {
              // @ts-ignore
              this.http.get(`/api/friends/by-userx/${userExtended.id}`).subscribe((friendsExtended: IUserExtended[]) => {
                // @ts-ignore
                let usersFriends: string[] = friendsExtended.map(aFriend => aFriend.user?.login); // extracts each username from the UserExtended objects
                usersFriends.push(this.username);
                if (usersFriends.includes(this.postBelongsTo)) {
                  this.loadPage();
                } else {
                  this.showPost = false;
                }
              });
            });
          } else {
            this.showPost = false;
          }
        });
      } else {
        this.showPost = false;
      }
    });
  }

  loadPage() {
    // @ts-ignore
    this.http.get(`/api/posts/${this.postID}`).subscribe((post: IPost) => {
      this.post = post;
      this.showPost = true;
      this.getComments();
    });
  }

  isValid(urlInput: string): boolean {
    const numericalRegex = /^[1-9][0-9]*$/;
    return numericalRegex.test(urlInput);
  }

  postExists(postID: string): Observable<boolean> {
    // Make the API call to check if the post exists
    return this.http.get(`/api/posts/${postID}`).pipe(
      map((post: any) => {
        // Extract the "createdBy" attribute from the post object
        this.postBelongsTo = post.createdBy;
        // If the API call is successful, return true to indicate that the post exists
        return true;
      }),
      catchError(() => {
        // If the API call returns any type of error, return false to indicate that
        // the post does not exist
        return of(false);
      })
    );
  }

  getCommentInput(commentValue: string): void {
    this.commentInput = commentValue;
    this.commentProvidedCondition = !(this.commentInput === '');
  }

  postComment(commentBox: HTMLTextAreaElement) {
    if (this.commentProvidedCondition) {
      this.commentProvidedCondition = false;
      commentBox.value = '';

      let postBody = {
        content: this.commentInput,
        author: this.username,
        postID: this.post.id.toString(),
        creationTime: dayjs(),
      };

      // after a comment is posted, the list of comments is updated to include new comments
      this.http.post('/api/comments', postBody).subscribe(
        () => {
          // @ts-ignore
          this.http.get(`/api/comments?postID.equals=${this.post.id}`).subscribe((allComments: IComment[]) => {
            this.comments = allComments;
          });
        },
        error => {
          console.warn('POST comment unsuccessful');
        }
      );

      this.commentInput = '';
    }
  }

  getComments() {
    this.http.get(`/api/comments?postID.equals=${this.post.id}`).subscribe(data => {
      // @ts-ignore
      this.comments = data.reverse();
    });
  }

  onDelete(data: IPost | IComment) {
    this.contentToDelete = data;
    this.modalService.showDeleteModal = true;
  }

  onReport(data: IPost | IComment) {
    this.contentToReport = data;
    this.modalService.showReportModal = true;
  }
}
