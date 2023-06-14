import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { IPost } from '../../entities/post/post.model';
import { IComment } from '../../entities/comment/comment.model';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { IUser } from '../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit {
  @Input() post: IPost;
  comments: IComment[];
  username: string;
  commentInput: string = '';
  commentProvidedCondition: boolean = false;
  @Output() deleteContent = new EventEmitter<IComment>();
  @Output() reportContent = new EventEmitter<IComment>();

  constructor(public modalService: ModalService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getComments();
    this.getUsername();
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.modalService.showViewPost = false;
  }

  /*
  This function is called when a key is pressed when the view post/comment screen
  is active. It's input comes from the EventListener created in the init above.
  When the escape key is pressed, the modal is destroyed.
  */
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.ngOnDestroy();
    }
  }

  getComments() {
    this.http.get(`/api/comments?postID.equals=${this.post.id}`).subscribe(data => {
      // @ts-ignore
      this.comments = data.reverse();
    });
  }

  getUsername(): void {
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // @ts-ignore
      this.username = data.login;
    });
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

  onDelete(data: IPost | IComment) {
    this.deleteContent.emit(data);
  }

  onReport(data: IPost | IComment) {
    this.reportContent.emit(data);
  }
}
