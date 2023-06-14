import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../after-study.test-samples';

import { AfterStudyFormService } from './after-study-form.service';

describe('AfterStudy Form Service', () => {
  let service: AfterStudyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfterStudyFormService);
  });

  describe('Service methods', () => {
    describe('createAfterStudyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAfterStudyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timeSpent: expect.any(Object),
            task: expect.any(Object),
          })
        );
      });

      it('passing IAfterStudy should create a new form with FormGroup', () => {
        const formGroup = service.createAfterStudyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timeSpent: expect.any(Object),
            task: expect.any(Object),
          })
        );
      });
    });

    describe('getAfterStudy', () => {
      it('should return NewAfterStudy for default AfterStudy initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAfterStudyFormGroup(sampleWithNewData);

        const afterStudy = service.getAfterStudy(formGroup) as any;

        expect(afterStudy).toMatchObject(sampleWithNewData);
      });

      it('should return NewAfterStudy for empty AfterStudy initial value', () => {
        const formGroup = service.createAfterStudyFormGroup();

        const afterStudy = service.getAfterStudy(formGroup) as any;

        expect(afterStudy).toMatchObject({});
      });

      it('should return IAfterStudy', () => {
        const formGroup = service.createAfterStudyFormGroup(sampleWithRequiredData);

        const afterStudy = service.getAfterStudy(formGroup) as any;

        expect(afterStudy).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAfterStudy should not enable id FormControl', () => {
        const formGroup = service.createAfterStudyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAfterStudy should disable id FormControl', () => {
        const formGroup = service.createAfterStudyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
