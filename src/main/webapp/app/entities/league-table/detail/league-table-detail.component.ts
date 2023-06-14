import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILeagueTable } from '../league-table.model';

@Component({
  selector: 'jhi-league-table-detail',
  templateUrl: './league-table-detail.component.html',
})
export class LeagueTableDetailComponent implements OnInit {
  leagueTable: ILeagueTable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leagueTable }) => {
      this.leagueTable = leagueTable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
