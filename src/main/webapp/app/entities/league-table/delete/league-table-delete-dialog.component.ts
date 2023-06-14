import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILeagueTable } from '../league-table.model';
import { LeagueTableService } from '../service/league-table.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './league-table-delete-dialog.component.html',
})
export class LeagueTableDeleteDialogComponent {
  leagueTable?: ILeagueTable;

  constructor(protected leagueTableService: LeagueTableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.leagueTableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
