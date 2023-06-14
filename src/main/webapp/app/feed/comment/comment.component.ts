import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IComment } from '../../entities/comment/comment.model';

@Component({
  selector: 'jhi-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment: IComment;
  @Input() username: string;
  commentBelongsToUser: boolean;
  @Output() deleteComment = new EventEmitter<IComment>();
  @Output() reportComment = new EventEmitter<IComment>();

  constructor() {}

  ngOnInit(): void {
    this.commentBelongsToUser = this.username === this.comment.author;
  }

  onDelete() {
    this.deleteComment.emit(this.comment);
  }

  onReport() {
    this.reportComment.emit(this.comment);
  }
}
