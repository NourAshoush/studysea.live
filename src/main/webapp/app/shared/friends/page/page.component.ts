import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AccountService } from '../../../core/auth/account.service';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../../core/auth/account.model';
import { Subject } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { IUserExtended } from '../../../entities/user-extended/user-extended.model';
import { IFriend } from '../../../entities/friend/friend.model';
import { IStudySession } from '../../../entities/study-session/study-session.model';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import QRCodeStyling from 'qr-code-styling';

@Component({
  selector: 'jhi-friends-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class FriendsPageComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  @Output() studySessionToJoin = new EventEmitter<IStudySession>();

  addFriendForm = this.formBuilder.group({
    code: '',
  });

  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  public userx: IUserExtended | null = null;
  public friends: IUserExtended[] | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    public modalService: ModalService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const accountId: number = account['id']; // this is messy, but the value should always be provided
        this.http.get<IUserExtended>(`/api/user-extendeds/by-user/${accountId}`).subscribe(data => {
          this.userx = data;
          this.getFriends(this.userx.id);
          const url = `${window.location.protocol}://${window.location.host}/friends/add/${this.userx.id}`;
          const colour =
            document.documentElement.classList.contains('dark-theme') || document.documentElement.classList.contains('high-contrast')
              ? '#000000'
              : '#2b4aac';
          const bgcolour = document.documentElement.classList.contains('high-contrast') ? '#ffffff' : 'transparent';
          const qrCode = new QRCodeStyling({
            width: 240,
            height: 240,
            type: 'svg',
            data: url,
            margin: 0,
            qrOptions: { typeNumber: 5, mode: 'Byte', errorCorrectionLevel: 'H' },
            dotsOptions: { type: 'classy-rounded', color: colour },
            backgroundOptions: { color: bgcolour },
            cornersSquareOptions: { color: colour },
            cornersDotOptions: { color: colour },
          });
          qrCode.append(this.canvas.nativeElement);
          this.canvas.nativeElement.setAttribute('data-url', url);
        });
      });
  }

  public getFriends(accountId: number): void {
    this.http.get<IUserExtended[]>(`/api/friends/by-userx/${accountId}`).subscribe(data => {
      this.friends = data;
    });
  }

  public removeFriend(friend: IUserExtended): void {
    if (this.userx !== null) {
      this.http.delete<IFriend>(`/api/friends/by-userx/${this.userx.id}/${friend.id}`).subscribe();
      if (this.friends != null) {
        this.friends = this.friends.filter(f => f.id !== friend.id);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addFriend(): void {
    const msg: string = <string>this.addFriendForm.value.code;
    this.router.navigate(['friends', 'add', msg]);
  }

  onJoin(studySessionToJoin: IStudySession) {
    this.studySessionToJoin.emit(studySessionToJoin);
  }
}
