import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILeagueTable, NewLeagueTable } from '../league-table.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILeagueTable for edit and NewLeagueTableFormGroupInput for create.
 */
type LeagueTableFormGroupInput = ILeagueTable | PartialWithRequiredKeyOf<NewLeagueTable>;

type LeagueTableFormDefaults = Pick<NewLeagueTable, 'id' | 'members'>;

type LeagueTableFormGroupContent = {
  id: FormControl<ILeagueTable['id'] | NewLeagueTable['id']>;
  name: FormControl<ILeagueTable['name']>;
  members: FormControl<ILeagueTable['members']>;
};

export type LeagueTableFormGroup = FormGroup<LeagueTableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LeagueTableFormService {
  createLeagueTableFormGroup(leagueTable: LeagueTableFormGroupInput = { id: null }): LeagueTableFormGroup {
    const leagueTableRawValue = {
      ...this.getFormDefaults(),
      ...leagueTable,
    };
    return new FormGroup<LeagueTableFormGroupContent>({
      id: new FormControl(
        { value: leagueTableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(leagueTableRawValue.name),
      members: new FormControl(leagueTableRawValue.members ?? []),
    });
  }

  getLeagueTable(form: LeagueTableFormGroup): ILeagueTable | NewLeagueTable {
    return form.getRawValue() as ILeagueTable | NewLeagueTable;
  }

  resetForm(form: LeagueTableFormGroup, leagueTable: LeagueTableFormGroupInput): void {
    const leagueTableRawValue = { ...this.getFormDefaults(), ...leagueTable };
    form.reset(
      {
        ...leagueTableRawValue,
        id: { value: leagueTableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LeagueTableFormDefaults {
    return {
      id: null,
      members: [],
    };
  }
}
