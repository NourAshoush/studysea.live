import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAfterStudy } from '../after-study.model';
import { AfterStudyService } from '../service/after-study.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './after-study-delete-dialog.component.html',
})
export class AfterStudyDeleteDialogComponent {
  afterStudy?: IAfterStudy;

  constructor(protected afterStudyService: AfterStudyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.afterStudyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
