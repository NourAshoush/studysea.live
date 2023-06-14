import { Component, OnInit } from '@angular/core';
import { AccountService } from '../core/auth/account.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../core/auth/account.model';
import { Subject } from 'rxjs';
import { ModalService } from '../shared/modal/modal.service';
import { IPost } from '../entities/post/post.model';
import { IComment } from '../entities/comment/comment.model';
import { UserSettingsService } from '../shared/user-settings.service';

@Component({
  selector: 'jhi-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  account: Account | null = null;
  selectedPost: IPost;
  contentToDelete: IPost | IComment;
  contentToReport: IPost | IComment;

  private readonly destroy$ = new Subject<void>();
  constructor(
    private accountService: AccountService,
    private router: Router,
    public modalService: ModalService,
    public userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.userSettingsService.setDisplayOnInit();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*
  This function triggers when the onViewPost function in posts.component.ts emits a post
  object event, which is automatically received here and turns on the modal for viewing a post
  */
  onViewPost(post: IPost) {
    this.selectedPost = post;
    this.modalService.showViewPost = true;
  }

  onDelete(data: IPost | IComment) {
    this.contentToDelete = data;
    this.modalService.showDeleteModal = true;
  }

  onReport(data: IPost | IComment) {
    this.contentToReport = data;
    this.modalService.showReportModal = true;
  }

  // handles key inputs for accessibility
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.modalService.showCreatePost = true;
    }
  }
}
