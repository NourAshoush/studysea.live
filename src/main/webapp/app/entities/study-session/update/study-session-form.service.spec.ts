import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../study-session.test-samples';

import { StudySessionFormService } from './study-session-form.service';

describe('StudySession Form Service', () => {
  let service: StudySessionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudySessionFormService);
  });

  describe('Service methods', () => {
    describe('createStudySessionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStudySessionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actualStart: expect.any(Object),
            isPrivate: expect.any(Object),
            task: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });

      it('passing IStudySession should create a new form with FormGroup', () => {
        const formGroup = service.createStudySessionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actualStart: expect.any(Object),
            isPrivate: expect.any(Object),
            task: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });
    });

    describe('getStudySession', () => {
      it('should return NewStudySession for default StudySession initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStudySessionFormGroup(sampleWithNewData);

        const studySession = service.getStudySession(formGroup) as any;

        expect(studySession).toMatchObject(sampleWithNewData);
      });

      it('should return NewStudySession for empty StudySession initial value', () => {
        const formGroup = service.createStudySessionFormGroup();

        const studySession = service.getStudySession(formGroup) as any;

        expect(studySession).toMatchObject({});
      });

      it('should return IStudySession', () => {
        const formGroup = service.createStudySessionFormGroup(sampleWithRequiredData);

        const studySession = service.getStudySession(formGroup) as any;

        expect(studySession).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStudySession should not enable id FormControl', () => {
        const formGroup = service.createStudySessionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStudySession should disable id FormControl', () => {
        const formGroup = service.createStudySessionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
