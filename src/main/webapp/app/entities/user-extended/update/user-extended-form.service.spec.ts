import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-extended.test-samples';

import { UserExtendedFormService } from './user-extended-form.service';

describe('UserExtended Form Service', () => {
  let service: UserExtendedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExtendedFormService);
  });

  describe('Service methods', () => {
    describe('createUserExtendedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserExtendedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            status: expect.any(Object),
            institution: expect.any(Object),
            course: expect.any(Object),
            description: expect.any(Object),
            privacy: expect.any(Object),
            darkMode: expect.any(Object),
            user: expect.any(Object),
            studySession: expect.any(Object),
            leagues: expect.any(Object),
          })
        );
      });

      it('passing IUserExtended should create a new form with FormGroup', () => {
        const formGroup = service.createUserExtendedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            status: expect.any(Object),
            institution: expect.any(Object),
            course: expect.any(Object),
            description: expect.any(Object),
            privacy: expect.any(Object),
            darkMode: expect.any(Object),
            user: expect.any(Object),
            studySession: expect.any(Object),
            leagues: expect.any(Object),
          })
        );
      });
    });

    describe('getUserExtended', () => {
      it('should return NewUserExtended for default UserExtended initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserExtendedFormGroup(sampleWithNewData);

        const userExtended = service.getUserExtended(formGroup) as any;

        expect(userExtended).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserExtended for empty UserExtended initial value', () => {
        const formGroup = service.createUserExtendedFormGroup();

        const userExtended = service.getUserExtended(formGroup) as any;

        expect(userExtended).toMatchObject({});
      });

      it('should return IUserExtended', () => {
        const formGroup = service.createUserExtendedFormGroup(sampleWithRequiredData);

        const userExtended = service.getUserExtended(formGroup) as any;

        expect(userExtended).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserExtended should not enable id FormControl', () => {
        const formGroup = service.createUserExtendedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserExtended should disable id FormControl', () => {
        const formGroup = service.createUserExtendedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
