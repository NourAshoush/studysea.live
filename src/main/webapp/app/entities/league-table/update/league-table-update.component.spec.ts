import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LeagueTableFormService } from './league-table-form.service';
import { LeagueTableService } from '../service/league-table.service';
import { ILeagueTable } from '../league-table.model';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

import { LeagueTableUpdateComponent } from './league-table-update.component';

describe('LeagueTable Management Update Component', () => {
  let comp: LeagueTableUpdateComponent;
  let fixture: ComponentFixture<LeagueTableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leagueTableFormService: LeagueTableFormService;
  let leagueTableService: LeagueTableService;
  let userExtendedService: UserExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LeagueTableUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LeagueTableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeagueTableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leagueTableFormService = TestBed.inject(LeagueTableFormService);
    leagueTableService = TestBed.inject(LeagueTableService);
    userExtendedService = TestBed.inject(UserExtendedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserExtended query and add missing value', () => {
      const leagueTable: ILeagueTable = { id: 456 };
      const members: IUserExtended[] = [{ id: 39725 }];
      leagueTable.members = members;

      const userExtendedCollection: IUserExtended[] = [{ id: 2799 }];
      jest.spyOn(userExtendedService, 'query').mockReturnValue(of(new HttpResponse({ body: userExtendedCollection })));
      const additionalUserExtendeds = [...members];
      const expectedCollection: IUserExtended[] = [...additionalUserExtendeds, ...userExtendedCollection];
      jest.spyOn(userExtendedService, 'addUserExtendedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leagueTable });
      comp.ngOnInit();

      expect(userExtendedService.query).toHaveBeenCalled();
      expect(userExtendedService.addUserExtendedToCollectionIfMissing).toHaveBeenCalledWith(
        userExtendedCollection,
        ...additionalUserExtendeds.map(expect.objectContaining)
      );
      expect(comp.userExtendedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const leagueTable: ILeagueTable = { id: 456 };
      const members: IUserExtended = { id: 48605 };
      leagueTable.members = [members];

      activatedRoute.data = of({ leagueTable });
      comp.ngOnInit();

      expect(comp.userExtendedsSharedCollection).toContain(members);
      expect(comp.leagueTable).toEqual(leagueTable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeagueTable>>();
      const leagueTable = { id: 123 };
      jest.spyOn(leagueTableFormService, 'getLeagueTable').mockReturnValue(leagueTable);
      jest.spyOn(leagueTableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leagueTable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leagueTable }));
      saveSubject.complete();

      // THEN
      expect(leagueTableFormService.getLeagueTable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(leagueTableService.update).toHaveBeenCalledWith(expect.objectContaining(leagueTable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeagueTable>>();
      const leagueTable = { id: 123 };
      jest.spyOn(leagueTableFormService, 'getLeagueTable').mockReturnValue({ id: null });
      jest.spyOn(leagueTableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leagueTable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leagueTable }));
      saveSubject.complete();

      // THEN
      expect(leagueTableFormService.getLeagueTable).toHaveBeenCalled();
      expect(leagueTableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeagueTable>>();
      const leagueTable = { id: 123 };
      jest.spyOn(leagueTableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leagueTable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leagueTableService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserExtended', () => {
      it('Should forward to userExtendedService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userExtendedService, 'compareUserExtended');
        comp.compareUserExtended(entity, entity2);
        expect(userExtendedService.compareUserExtended).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
