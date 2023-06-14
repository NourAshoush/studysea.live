import { Component, Input, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal/modal.service';
import { IPost } from '../../entities/post/post.model';
import { IComment } from '../../entities/comment/comment.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-delete-post-or-comment',
  templateUrl: './delete-post-or-comment.component.html',
  styleUrls: ['./delete-post-or-comment.component.scss'],
})
export class DeletePostOrCommentComponent implements OnInit {
  @Input() contentToDelete: IPost | IComment;
  contentTypeIsPost: boolean;
  postToDelete: IPost;
  commentToDelete: IComment;

  constructor(public modalService: ModalService, public http: HttpClient) {}

  ngOnInit(): void {
    this.contentType(this.contentToDelete);
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.modalService.showDeleteModal = false;
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.ngOnDestroy();
    }
  }

  isPost(data: any): data is IPost {
    return 'title' in data;
  }

  contentType(data: IPost | IComment) {
    this.contentTypeIsPost = this.isPost(data);
    if (this.contentTypeIsPost) this.postToDelete = data;
    else this.commentToDelete = data;
  }

  deleteContent() {
    if (this.contentTypeIsPost) {
      this.http.delete(`/api/posts/${this.postToDelete.id}`).subscribe();
      this.ngOnDestroy();
      window.location.reload();
    } else {
      this.http.delete(`/api/comments/${this.commentToDelete.id}`).subscribe();
      this.ngOnDestroy();
    }
  }
}
