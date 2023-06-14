import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserExtended } from '../user-extended.model';
import { UserExtendedService } from '../service/user-extended.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-extended-delete-dialog.component.html',
})
export class UserExtendedDeleteDialogComponent {
  userExtended?: IUserExtended;

  constructor(protected userExtendedService: UserExtendedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userExtendedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
