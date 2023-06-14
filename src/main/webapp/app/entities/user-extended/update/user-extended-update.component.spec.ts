import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserExtendedFormService } from './user-extended-form.service';
import { UserExtendedService } from '../service/user-extended.service';
import { IUserExtended } from '../user-extended.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IStudySession } from 'app/entities/study-session/study-session.model';
import { StudySessionService } from 'app/entities/study-session/service/study-session.service';

import { UserExtendedUpdateComponent } from './user-extended-update.component';

describe('UserExtended Management Update Component', () => {
  let comp: UserExtendedUpdateComponent;
  let fixture: ComponentFixture<UserExtendedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userExtendedFormService: UserExtendedFormService;
  let userExtendedService: UserExtendedService;
  let userService: UserService;
  let studySessionService: StudySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserExtendedUpdateComponent],
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
      .overrideTemplate(UserExtendedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExtendedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userExtendedFormService = TestBed.inject(UserExtendedFormService);
    userExtendedService = TestBed.inject(UserExtendedService);
    userService = TestBed.inject(UserService);
    studySessionService = TestBed.inject(StudySessionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userExtended: IUserExtended = { id: 456 };
      const user: IUser = { id: 67864 };
      userExtended.user = user;

      const userCollection: IUser[] = [{ id: 63601 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call StudySession query and add missing value', () => {
      const userExtended: IUserExtended = { id: 456 };
      const studySession: IStudySession = { id: 66843 };
      userExtended.studySession = studySession;

      const studySessionCollection: IStudySession[] = [{ id: 78651 }];
      jest.spyOn(studySessionService, 'query').mockReturnValue(of(new HttpResponse({ body: studySessionCollection })));
      const additionalStudySessions = [studySession];
      const expectedCollection: IStudySession[] = [...additionalStudySessions, ...studySessionCollection];
      jest.spyOn(studySessionService, 'addStudySessionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      expect(studySessionService.query).toHaveBeenCalled();
      expect(studySessionService.addStudySessionToCollectionIfMissing).toHaveBeenCalledWith(
        studySessionCollection,
        ...additionalStudySessions.map(expect.objectContaining)
      );
      expect(comp.studySessionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userExtended: IUserExtended = { id: 456 };
      const user: IUser = { id: 57917 };
      userExtended.user = user;
      const studySession: IStudySession = { id: 81830 };
      userExtended.studySession = studySession;

      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.studySessionsSharedCollection).toContain(studySession);
      expect(comp.userExtended).toEqual(userExtended);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExtended>>();
      const userExtended = { id: 123 };
      jest.spyOn(userExtendedFormService, 'getUserExtended').mockReturnValue(userExtended);
      jest.spyOn(userExtendedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtended }));
      saveSubject.complete();

      // THEN
      expect(userExtendedFormService.getUserExtended).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userExtendedService.update).toHaveBeenCalledWith(expect.objectContaining(userExtended));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExtended>>();
      const userExtended = { id: 123 };
      jest.spyOn(userExtendedFormService, 'getUserExtended').mockReturnValue({ id: null });
      jest.spyOn(userExtendedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtended: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtended }));
      saveSubject.complete();

      // THEN
      expect(userExtendedFormService.getUserExtended).toHaveBeenCalled();
      expect(userExtendedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExtended>>();
      const userExtended = { id: 123 };
      jest.spyOn(userExtendedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userExtendedService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStudySession', () => {
      it('Should forward to studySessionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studySessionService, 'compareStudySession');
        comp.compareStudySession(entity, entity2);
        expect(studySessionService.compareStudySession).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
