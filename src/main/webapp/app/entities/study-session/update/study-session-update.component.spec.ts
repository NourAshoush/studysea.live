import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudySessionFormService } from './study-session-form.service';
import { StudySessionService } from '../service/study-session.service';
import { IStudySession } from '../study-session.model';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

import { StudySessionUpdateComponent } from './study-session-update.component';

describe('StudySession Management Update Component', () => {
  let comp: StudySessionUpdateComponent;
  let fixture: ComponentFixture<StudySessionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studySessionFormService: StudySessionFormService;
  let studySessionService: StudySessionService;
  let taskService: TaskService;
  let userExtendedService: UserExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudySessionUpdateComponent],
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
      .overrideTemplate(StudySessionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudySessionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studySessionFormService = TestBed.inject(StudySessionFormService);
    studySessionService = TestBed.inject(StudySessionService);
    taskService = TestBed.inject(TaskService);
    userExtendedService = TestBed.inject(UserExtendedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Task query and add missing value', () => {
      const studySession: IStudySession = { id: 456 };
      const task: ITask = { id: 3329 };
      studySession.task = task;

      const taskCollection: ITask[] = [{ id: 52405 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [task];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studySession });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining)
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserExtended query and add missing value', () => {
      const studySession: IStudySession = { id: 456 };
      const owner: IUserExtended = { id: 40891 };
      studySession.owner = owner;

      const userExtendedCollection: IUserExtended[] = [{ id: 27533 }];
      jest.spyOn(userExtendedService, 'query').mockReturnValue(of(new HttpResponse({ body: userExtendedCollection })));
      const additionalUserExtendeds = [owner];
      const expectedCollection: IUserExtended[] = [...additionalUserExtendeds, ...userExtendedCollection];
      jest.spyOn(userExtendedService, 'addUserExtendedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studySession });
      comp.ngOnInit();

      expect(userExtendedService.query).toHaveBeenCalled();
      expect(userExtendedService.addUserExtendedToCollectionIfMissing).toHaveBeenCalledWith(
        userExtendedCollection,
        ...additionalUserExtendeds.map(expect.objectContaining)
      );
      expect(comp.userExtendedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const studySession: IStudySession = { id: 456 };
      const task: ITask = { id: 80873 };
      studySession.task = task;
      const owner: IUserExtended = { id: 57479 };
      studySession.owner = owner;

      activatedRoute.data = of({ studySession });
      comp.ngOnInit();

      expect(comp.tasksSharedCollection).toContain(task);
      expect(comp.userExtendedsSharedCollection).toContain(owner);
      expect(comp.studySession).toEqual(studySession);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudySession>>();
      const studySession = { id: 123 };
      jest.spyOn(studySessionFormService, 'getStudySession').mockReturnValue(studySession);
      jest.spyOn(studySessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studySession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studySession }));
      saveSubject.complete();

      // THEN
      expect(studySessionFormService.getStudySession).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studySessionService.update).toHaveBeenCalledWith(expect.objectContaining(studySession));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudySession>>();
      const studySession = { id: 123 };
      jest.spyOn(studySessionFormService, 'getStudySession').mockReturnValue({ id: null });
      jest.spyOn(studySessionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studySession: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studySession }));
      saveSubject.complete();

      // THEN
      expect(studySessionFormService.getStudySession).toHaveBeenCalled();
      expect(studySessionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudySession>>();
      const studySession = { id: 123 };
      jest.spyOn(studySessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studySession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studySessionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTask', () => {
      it('Should forward to taskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(taskService, 'compareTask');
        comp.compareTask(entity, entity2);
        expect(taskService.compareTask).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
