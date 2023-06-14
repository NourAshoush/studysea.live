import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILeagueTable } from '../league-table.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../league-table.test-samples';

import { LeagueTableService } from './league-table.service';

const requireRestSample: ILeagueTable = {
  ...sampleWithRequiredData,
};

describe('LeagueTable Service', () => {
  let service: LeagueTableService;
  let httpMock: HttpTestingController;
  let expectedResult: ILeagueTable | ILeagueTable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LeagueTableService);
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

    it('should create a LeagueTable', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const leagueTable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(leagueTable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LeagueTable', () => {
      const leagueTable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(leagueTable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LeagueTable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LeagueTable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LeagueTable', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLeagueTableToCollectionIfMissing', () => {
      it('should add a LeagueTable to an empty array', () => {
        const leagueTable: ILeagueTable = sampleWithRequiredData;
        expectedResult = service.addLeagueTableToCollectionIfMissing([], leagueTable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leagueTable);
      });

      it('should not add a LeagueTable to an array that contains it', () => {
        const leagueTable: ILeagueTable = sampleWithRequiredData;
        const leagueTableCollection: ILeagueTable[] = [
          {
            ...leagueTable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLeagueTableToCollectionIfMissing(leagueTableCollection, leagueTable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LeagueTable to an array that doesn't contain it", () => {
        const leagueTable: ILeagueTable = sampleWithRequiredData;
        const leagueTableCollection: ILeagueTable[] = [sampleWithPartialData];
        expectedResult = service.addLeagueTableToCollectionIfMissing(leagueTableCollection, leagueTable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leagueTable);
      });

      it('should add only unique LeagueTable to an array', () => {
        const leagueTableArray: ILeagueTable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const leagueTableCollection: ILeagueTable[] = [sampleWithRequiredData];
        expectedResult = service.addLeagueTableToCollectionIfMissing(leagueTableCollection, ...leagueTableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const leagueTable: ILeagueTable = sampleWithRequiredData;
        const leagueTable2: ILeagueTable = sampleWithPartialData;
        expectedResult = service.addLeagueTableToCollectionIfMissing([], leagueTable, leagueTable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leagueTable);
        expect(expectedResult).toContain(leagueTable2);
      });

      it('should accept null and undefined values', () => {
        const leagueTable: ILeagueTable = sampleWithRequiredData;
        expectedResult = service.addLeagueTableToCollectionIfMissing([], null, leagueTable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leagueTable);
      });

      it('should return initial array if no LeagueTable is added', () => {
        const leagueTableCollection: ILeagueTable[] = [sampleWithRequiredData];
        expectedResult = service.addLeagueTableToCollectionIfMissing(leagueTableCollection, undefined, null);
        expect(expectedResult).toEqual(leagueTableCollection);
      });
    });

    describe('compareLeagueTable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLeagueTable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLeagueTable(entity1, entity2);
        const compareResult2 = service.compareLeagueTable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLeagueTable(entity1, entity2);
        const compareResult2 = service.compareLeagueTable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLeagueTable(entity1, entity2);
        const compareResult2 = service.compareLeagueTable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
