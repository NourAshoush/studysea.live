import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudySession } from '../study-session.model';
import { StudySessionService } from '../service/study-session.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './study-session-delete-dialog.component.html',
})
export class StudySessionDeleteDialogComponent {
  studySession?: IStudySession;

  constructor(protected studySessionService: StudySessionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studySessionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
