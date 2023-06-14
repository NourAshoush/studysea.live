import { Component, Input } from '@angular/core';
import { ILeagueTable } from '../../entities/league-table/league-table.model';

@Component({
  selector: 'app-league-tables',
  templateUrl: './league-tables.component.html',
  styleUrls: ['./league-tables.component.scss'],
})
export class LeagueTablesComponent {
  @Input() leagues: ILeagueTable[] = [];
}
