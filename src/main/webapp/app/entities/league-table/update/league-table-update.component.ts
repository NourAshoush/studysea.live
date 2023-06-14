import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LeagueTableFormService, LeagueTableFormGroup } from './league-table-form.service';
import { ILeagueTable } from '../league-table.model';
import { LeagueTableService } from '../service/league-table.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

@Component({
  selector: 'jhi-league-table-update',
  templateUrl: './league-table-update.component.html',
})
export class LeagueTableUpdateComponent implements OnInit {
  isSaving = false;
  leagueTable: ILeagueTable | null = null;

  userExtendedsSharedCollection: IUserExtended[] = [];

  editForm: LeagueTableFormGroup = this.leagueTableFormService.createLeagueTableFormGroup();

  constructor(
    protected leagueTableService: LeagueTableService,
    protected leagueTableFormService: LeagueTableFormService,
    protected userExtendedService: UserExtendedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserExtended = (o1: IUserExtended | null, o2: IUserExtended | null): boolean =>
    this.userExtendedService.compareUserExtended(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leagueTable }) => {
      this.leagueTable = leagueTable;
      if (leagueTable) {
        this.updateForm(leagueTable);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const leagueTable = this.leagueTableFormService.getLeagueTable(this.editForm);
    if (leagueTable.id !== null) {
      this.subscribeToSaveResponse(this.leagueTableService.update(leagueTable));
    } else {
      this.subscribeToSaveResponse(this.leagueTableService.create(leagueTable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeagueTable>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(leagueTable: ILeagueTable): void {
    this.leagueTable = leagueTable;
    this.leagueTableFormService.resetForm(this.editForm, leagueTable);

    this.userExtendedsSharedCollection = this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(
      this.userExtendedsSharedCollection,
      ...(leagueTable.members ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userExtendedService
      .query()
      .pipe(map((res: HttpResponse<IUserExtended[]>) => res.body ?? []))
      .pipe(
        map((userExtendeds: IUserExtended[]) =>
          this.userExtendedService.addUserExtendedToCollectionIfMissing<IUserExtended>(userExtendeds, ...(this.leagueTable?.members ?? []))
        )
      )
      .subscribe((userExtendeds: IUserExtended[]) => (this.userExtendedsSharedCollection = userExtendeds));
  }
}
