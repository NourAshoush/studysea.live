import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../friend.test-samples';

import { FriendFormService } from './friend-form.service';

describe('Friend Form Service', () => {
  let service: FriendFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendFormService);
  });

  describe('Service methods', () => {
    describe('createFriendFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFriendFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            friendshipFrom: expect.any(Object),
            friendshipTo: expect.any(Object),
          })
        );
      });

      it('passing IFriend should create a new form with FormGroup', () => {
        const formGroup = service.createFriendFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            friendshipFrom: expect.any(Object),
            friendshipTo: expect.any(Object),
          })
        );
      });
    });

    describe('getFriend', () => {
      it('should return NewFriend for default Friend initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFriendFormGroup(sampleWithNewData);

        const friend = service.getFriend(formGroup) as any;

        expect(friend).toMatchObject(sampleWithNewData);
      });

      it('should return NewFriend for empty Friend initial value', () => {
        const formGroup = service.createFriendFormGroup();

        const friend = service.getFriend(formGroup) as any;

        expect(friend).toMatchObject({});
      });

      it('should return IFriend', () => {
        const formGroup = service.createFriendFormGroup(sampleWithRequiredData);

        const friend = service.getFriend(formGroup) as any;

        expect(friend).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFriend should not enable id FormControl', () => {
        const formGroup = service.createFriendFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFriend should disable id FormControl', () => {
        const formGroup = service.createFriendFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
