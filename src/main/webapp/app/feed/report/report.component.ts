import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { IPost } from '../../entities/post/post.model';
import { IComment } from '../../entities/comment/comment.model';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { IUser } from '../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @Input() contentToReport: IPost | IComment;
  contentTypeIsPost: boolean;
  postToReport: IPost;
  commentToReport: IComment;
  username: string;
  textareaInputAlt: string;

  constructor(public modalService: ModalService, public http: HttpClient) {}

  ngOnInit(): void {
    this.contentType(this.contentToReport);
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // @ts-ignore
      this.username = data.login;
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.modalService.showReportModal = false;
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.ngOnDestroy();
    } else if (event.key === 'Enter') {
      this.reportContent(this.textareaInputAlt);
    }
  }

  updateAltVar(reasonText: string) {
    this.textareaInputAlt = reasonText;
  }

  isPost(data: any): data is IPost {
    return 'title' in data;
  }

  contentType(data: IPost | IComment) {
    this.contentTypeIsPost = this.isPost(data);
    if (this.contentTypeIsPost) this.postToReport = data;
    else this.commentToReport = data;
  }

  reportContent(reasonText: string) {
    if (this.contentTypeIsPost) {
      let postBody = {
        contentType: 'Post',
        contentID: this.postToReport.id.toString(),
        contentAuthor: this.postToReport.createdBy,
        reportedBy: this.username,
        reportedTime: dayjs(),
        reportedReason: reasonText,
      };
      this.http.post('/api/reports', postBody).subscribe();
      this.ngOnDestroy();
    } else {
      let postBody = {
        contentType: 'Comment',
        contentID: this.commentToReport.id.toString(),
        contentAuthor: this.commentToReport.author,
        reportedBy: this.username,
        reportedTime: dayjs(),
        reportedReason: reasonText,
      };
      this.http.post('/api/reports', postBody).subscribe();
      this.ngOnDestroy();
    }
  }
}
