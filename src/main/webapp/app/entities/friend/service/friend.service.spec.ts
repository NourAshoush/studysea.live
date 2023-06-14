import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFriend } from '../friend.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../friend.test-samples';

import { FriendService } from './friend.service';

const requireRestSample: IFriend = {
  ...sampleWithRequiredData,
};

describe('Friend Service', () => {
  let service: FriendService;
  let httpMock: HttpTestingController;
  let expectedResult: IFriend | IFriend[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FriendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Friend', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const friend = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(friend).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Friend', () => {
      const friend = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(friend).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Friend', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Friend', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Friend', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFriendToCollectionIfMissing', () => {
      it('should add a Friend to an empty array', () => {
        const friend: IFriend = sampleWithRequiredData;
        expectedResult = service.addFriendToCollectionIfMissing([], friend);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friend);
      });

      it('should not add a Friend to an array that contains it', () => {
        const friend: IFriend = sampleWithRequiredData;
        const friendCollection: IFriend[] = [
          {
            ...friend,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFriendToCollectionIfMissing(friendCollection, friend);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Friend to an array that doesn't contain it", () => {
        const friend: IFriend = sampleWithRequiredData;
        const friendCollection: IFriend[] = [sampleWithPartialData];
        expectedResult = service.addFriendToCollectionIfMissing(friendCollection, friend);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friend);
      });

      it('should add only unique Friend to an array', () => {
        const friendArray: IFriend[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const friendCollection: IFriend[] = [sampleWithRequiredData];
        expectedResult = service.addFriendToCollectionIfMissing(friendCollection, ...friendArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const friend: IFriend = sampleWithRequiredData;
        const friend2: IFriend = sampleWithPartialData;
        expectedResult = service.addFriendToCollectionIfMissing([], friend, friend2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friend);
        expect(expectedResult).toContain(friend2);
      });

      it('should accept null and undefined values', () => {
        const friend: IFriend = sampleWithRequiredData;
        expectedResult = service.addFriendToCollectionIfMissing([], null, friend, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friend);
      });

      it('should return initial array if no Friend is added', () => {
        const friendCollection: IFriend[] = [sampleWithRequiredData];
        expectedResult = service.addFriendToCollectionIfMissing(friendCollection, undefined, null);
        expect(expectedResult).toEqual(friendCollection);
      });
    });

    describe('compareFriend', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFriend(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFriend(entity1, entity2);
        const compareResult2 = service.compareFriend(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFriend(entity1, entity2);
        const compareResult2 = service.compareFriend(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFriend(entity1, entity2);
        const compareResult2 = service.compareFriend(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
