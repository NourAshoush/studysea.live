import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LeagueTableComponent } from './list/league-table.component';
import { LeagueTableDetailComponent } from './detail/league-table-detail.component';
import { LeagueTableUpdateComponent } from './update/league-table-update.component';
import { LeagueTableDeleteDialogComponent } from './delete/league-table-delete-dialog.component';
import { LeagueTableRoutingModule } from './route/league-table-routing.module';

@NgModule({
  imports: [SharedModule, LeagueTableRoutingModule],
  declarations: [LeagueTableComponent, LeagueTableDetailComponent, LeagueTableUpdateComponent, LeagueTableDeleteDialogComponent],
})
export class LeagueTableModule {}
