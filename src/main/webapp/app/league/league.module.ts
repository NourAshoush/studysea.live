import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { JOIN_LEAGUE_ROUTE, LEAGUE_ROUTE } from './league.route';
import { LeagueComponent } from './league.component';
import { JoinComponent } from './join/join.component';
import { LeagueTableComponent } from './league-table/league-table.component';
import { LeagueTablesComponent } from './league-tables/league-tables.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([LEAGUE_ROUTE, JOIN_LEAGUE_ROUTE])],
  declarations: [LeagueComponent, JoinComponent, LeagueTableComponent, LeagueTablesComponent],
  exports: [JoinComponent],
})
export class LeagueModule {}
