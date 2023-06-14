import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAfterStudy } from '../after-study.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../after-study.test-samples';

import { AfterStudyService } from './after-study.service';

const requireRestSample: IAfterStudy = {
  ...sampleWithRequiredData,
};

describe('AfterStudy Service', () => {
  let service: AfterStudyService;
  let httpMock: HttpTestingController;
  let expectedResult: IAfterStudy | IAfterStudy[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AfterStudyService);
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

    it('should create a AfterStudy', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const afterStudy = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(afterStudy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AfterStudy', () => {
      const afterStudy = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(afterStudy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AfterStudy', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AfterStudy', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AfterStudy', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAfterStudyToCollectionIfMissing', () => {
      it('should add a AfterStudy to an empty array', () => {
        const afterStudy: IAfterStudy = sampleWithRequiredData;
        expectedResult = service.addAfterStudyToCollectionIfMissing([], afterStudy);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(afterStudy);
      });

      it('should not add a AfterStudy to an array that contains it', () => {
        const afterStudy: IAfterStudy = sampleWithRequiredData;
        const afterStudyCollection: IAfterStudy[] = [
          {
            ...afterStudy,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAfterStudyToCollectionIfMissing(afterStudyCollection, afterStudy);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AfterStudy to an array that doesn't contain it", () => {
        const afterStudy: IAfterStudy = sampleWithRequiredData;
        const afterStudyCollection: IAfterStudy[] = [sampleWithPartialData];
        expectedResult = service.addAfterStudyToCollectionIfMissing(afterStudyCollection, afterStudy);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(afterStudy);
      });

      it('should add only unique AfterStudy to an array', () => {
        const afterStudyArray: IAfterStudy[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const afterStudyCollection: IAfterStudy[] = [sampleWithRequiredData];
        expectedResult = service.addAfterStudyToCollectionIfMissing(afterStudyCollection, ...afterStudyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const afterStudy: IAfterStudy = sampleWithRequiredData;
        const afterStudy2: IAfterStudy = sampleWithPartialData;
        expectedResult = service.addAfterStudyToCollectionIfMissing([], afterStudy, afterStudy2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(afterStudy);
        expect(expectedResult).toContain(afterStudy2);
      });

      it('should accept null and undefined values', () => {
        const afterStudy: IAfterStudy = sampleWithRequiredData;
        expectedResult = service.addAfterStudyToCollectionIfMissing([], null, afterStudy, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(afterStudy);
      });

      it('should return initial array if no AfterStudy is added', () => {
        const afterStudyCollection: IAfterStudy[] = [sampleWithRequiredData];
        expectedResult = service.addAfterStudyToCollectionIfMissing(afterStudyCollection, undefined, null);
        expect(expectedResult).toEqual(afterStudyCollection);
      });
    });

    describe('compareAfterStudy', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAfterStudy(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAfterStudy(entity1, entity2);
        const compareResult2 = service.compareAfterStudy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAfterStudy(entity1, entity2);
        const compareResult2 = service.compareAfterStudy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAfterStudy(entity1, entity2);
        const compareResult2 = service.compareAfterStudy(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
