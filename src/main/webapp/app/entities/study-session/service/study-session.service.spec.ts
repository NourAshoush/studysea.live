import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStudySession } from '../study-session.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../study-session.test-samples';

import { StudySessionService, RestStudySession } from './study-session.service';

const requireRestSample: RestStudySession = {
  ...sampleWithRequiredData,
  actualStart: sampleWithRequiredData.actualStart?.toJSON(),
};

describe('StudySession Service', () => {
  let service: StudySessionService;
  let httpMock: HttpTestingController;
  let expectedResult: IStudySession | IStudySession[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StudySessionService);
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

    it('should create a StudySession', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const studySession = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(studySession).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StudySession', () => {
      const studySession = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(studySession).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StudySession', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StudySession', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StudySession', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStudySessionToCollectionIfMissing', () => {
      it('should add a StudySession to an empty array', () => {
        const studySession: IStudySession = sampleWithRequiredData;
        expectedResult = service.addStudySessionToCollectionIfMissing([], studySession);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studySession);
      });

      it('should not add a StudySession to an array that contains it', () => {
        const studySession: IStudySession = sampleWithRequiredData;
        const studySessionCollection: IStudySession[] = [
          {
            ...studySession,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStudySessionToCollectionIfMissing(studySessionCollection, studySession);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StudySession to an array that doesn't contain it", () => {
        const studySession: IStudySession = sampleWithRequiredData;
        const studySessionCollection: IStudySession[] = [sampleWithPartialData];
        expectedResult = service.addStudySessionToCollectionIfMissing(studySessionCollection, studySession);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studySession);
      });

      it('should add only unique StudySession to an array', () => {
        const studySessionArray: IStudySession[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const studySessionCollection: IStudySession[] = [sampleWithRequiredData];
        expectedResult = service.addStudySessionToCollectionIfMissing(studySessionCollection, ...studySessionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const studySession: IStudySession = sampleWithRequiredData;
        const studySession2: IStudySession = sampleWithPartialData;
        expectedResult = service.addStudySessionToCollectionIfMissing([], studySession, studySession2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studySession);
        expect(expectedResult).toContain(studySession2);
      });

      it('should accept null and undefined values', () => {
        const studySession: IStudySession = sampleWithRequiredData;
        expectedResult = service.addStudySessionToCollectionIfMissing([], null, studySession, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studySession);
      });

      it('should return initial array if no StudySession is added', () => {
        const studySessionCollection: IStudySession[] = [sampleWithRequiredData];
        expectedResult = service.addStudySessionToCollectionIfMissing(studySessionCollection, undefined, null);
        expect(expectedResult).toEqual(studySessionCollection);
      });
    });

    describe('compareStudySession', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStudySession(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStudySession(entity1, entity2);
        const compareResult2 = service.compareStudySession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStudySession(entity1, entity2);
        const compareResult2 = service.compareStudySession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStudySession(entity1, entity2);
        const compareResult2 = service.compareStudySession(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
