import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUserExtended } from '../../../entities/user-extended/user-extended.model';
import { FriendsPageComponent } from '../page/page.component';
import { IStudySession } from '../../../entities/study-session/study-session.model';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'jhi-friend-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class FriendsListComponent {
  @Input() friends: IUserExtended[] | null;
  @Input() context: FriendsPageComponent;
  @Output() joinSession = new EventEmitter<IStudySession>();

  constructor(private http: HttpClient, public modalService: ModalService) {}

  onJoin(friendToJoin: IUserExtended) {
    // @ts-ignore
    this.http.get(`/api/study-sessions/${friendToJoin.studySession?.id}`).subscribe((studySessionToJoin: IStudySession) => {
      this.joinSession.emit(studySessionToJoin);
    });
  }

  // @ts-ignore
  checkFriendInPublicSession(user: IUserExtended): boolean {
    if (user.studySession != null) {
      // @ts-ignore
      this.http.get(`/api/study-sessions/${user.studySession.id}`).subscribe((studySession: IStudySession) => {
        return studySession.isPrivate != true;
      });
    } else return false;
  }
}
