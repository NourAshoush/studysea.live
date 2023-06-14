import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showCreatePost = false;
  showViewPost = false;
  showDeleteModal = false;
  showReportModal = false;
  showCreateTask = false;
  showCreateLeague = false;
  showNewStudySession = false;
  showJoinBuddySession = false;
  showJoinFriendSession = false;
  showConfirmExitSessionBreak = false;
  showConfirmExitSessionStudy = false;
}
