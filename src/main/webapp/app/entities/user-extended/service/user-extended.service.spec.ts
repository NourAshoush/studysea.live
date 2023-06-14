import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserExtended } from '../user-extended.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-extended.test-samples';

import { UserExtendedService } from './user-extended.service';

const requireRestSample: IUserExtended = {
  ...sampleWithRequiredData,
};

describe('UserExtended Service', () => {
  let service: UserExtendedService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserExtended | IUserExtended[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserExtendedService);
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

    it('should create a UserExtended', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userExtended = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userExtended).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserExtended', () => {
      const userExtended = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userExtended).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserExtended', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserExtended', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserExtended', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserExtendedToCollectionIfMissing', () => {
      it('should add a UserExtended to an empty array', () => {
        const userExtended: IUserExtended = sampleWithRequiredData;
        expectedResult = service.addUserExtendedToCollectionIfMissing([], userExtended);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtended);
      });

      it('should not add a UserExtended to an array that contains it', () => {
        const userExtended: IUserExtended = sampleWithRequiredData;
        const userExtendedCollection: IUserExtended[] = [
          {
            ...userExtended,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, userExtended);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserExtended to an array that doesn't contain it", () => {
        const userExtended: IUserExtended = sampleWithRequiredData;
        const userExtendedCollection: IUserExtended[] = [sampleWithPartialData];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, userExtended);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtended);
      });

      it('should add only unique UserExtended to an array', () => {
        const userExtendedArray: IUserExtended[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userExtendedCollection: IUserExtended[] = [sampleWithRequiredData];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, ...userExtendedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userExtended: IUserExtended = sampleWithRequiredData;
        const userExtended2: IUserExtended = sampleWithPartialData;
        expectedResult = service.addUserExtendedToCollectionIfMissing([], userExtended, userExtended2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtended);
        expect(expectedResult).toContain(userExtended2);
      });

      it('should accept null and undefined values', () => {
        const userExtended: IUserExtended = sampleWithRequiredData;
        expectedResult = service.addUserExtendedToCollectionIfMissing([], null, userExtended, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtended);
      });

      it('should return initial array if no UserExtended is added', () => {
        const userExtendedCollection: IUserExtended[] = [sampleWithRequiredData];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, undefined, null);
        expect(expectedResult).toEqual(userExtendedCollection);
      });
    });

    describe('compareUserExtended', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserExtended(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserExtended(entity1, entity2);
        const compareResult2 = service.compareUserExtended(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserExtended(entity1, entity2);
        const compareResult2 = service.compareUserExtended(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserExtended(entity1, entity2);
        const compareResult2 = service.compareUserExtended(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
