import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../league-table.test-samples';

import { LeagueTableFormService } from './league-table-form.service';

describe('LeagueTable Form Service', () => {
  let service: LeagueTableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueTableFormService);
  });

  describe('Service methods', () => {
    describe('createLeagueTableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLeagueTableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            members: expect.any(Object),
          })
        );
      });

      it('passing ILeagueTable should create a new form with FormGroup', () => {
        const formGroup = service.createLeagueTableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            members: expect.any(Object),
          })
        );
      });
    });

    describe('getLeagueTable', () => {
      it('should return NewLeagueTable for default LeagueTable initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLeagueTableFormGroup(sampleWithNewData);

        const leagueTable = service.getLeagueTable(formGroup) as any;

        expect(leagueTable).toMatchObject(sampleWithNewData);
      });

      it('should return NewLeagueTable for empty LeagueTable initial value', () => {
        const formGroup = service.createLeagueTableFormGroup();

        const leagueTable = service.getLeagueTable(formGroup) as any;

        expect(leagueTable).toMatchObject({});
      });

      it('should return ILeagueTable', () => {
        const formGroup = service.createLeagueTableFormGroup(sampleWithRequiredData);

        const leagueTable = service.getLeagueTable(formGroup) as any;

        expect(leagueTable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILeagueTable should not enable id FormControl', () => {
        const formGroup = service.createLeagueTableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLeagueTable should disable id FormControl', () => {
        const formGroup = service.createLeagueTableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
