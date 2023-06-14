import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AfterStudyFormService } from './after-study-form.service';
import { AfterStudyService } from '../service/after-study.service';
import { IAfterStudy } from '../after-study.model';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

import { AfterStudyUpdateComponent } from './after-study-update.component';

describe('AfterStudy Management Update Component', () => {
  let comp: AfterStudyUpdateComponent;
  let fixture: ComponentFixture<AfterStudyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let afterStudyFormService: AfterStudyFormService;
  let afterStudyService: AfterStudyService;
  let taskService: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AfterStudyUpdateComponent],
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
      .overrideTemplate(AfterStudyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AfterStudyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    afterStudyFormService = TestBed.inject(AfterStudyFormService);
    afterStudyService = TestBed.inject(AfterStudyService);
    taskService = TestBed.inject(TaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Task query and add missing value', () => {
      const afterStudy: IAfterStudy = { id: 456 };
      const task: ITask = { id: 44299 };
      afterStudy.task = task;

      const taskCollection: ITask[] = [{ id: 94445 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [task];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ afterStudy });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining)
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const afterStudy: IAfterStudy = { id: 456 };
      const task: ITask = { id: 55151 };
      afterStudy.task = task;

      activatedRoute.data = of({ afterStudy });
      comp.ngOnInit();

      expect(comp.tasksSharedCollection).toContain(task);
      expect(comp.afterStudy).toEqual(afterStudy);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAfterStudy>>();
      const afterStudy = { id: 123 };
      jest.spyOn(afterStudyFormService, 'getAfterStudy').mockReturnValue(afterStudy);
      jest.spyOn(afterStudyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ afterStudy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: afterStudy }));
      saveSubject.complete();

      // THEN
      expect(afterStudyFormService.getAfterStudy).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(afterStudyService.update).toHaveBeenCalledWith(expect.objectContaining(afterStudy));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAfterStudy>>();
      const afterStudy = { id: 123 };
      jest.spyOn(afterStudyFormService, 'getAfterStudy').mockReturnValue({ id: null });
      jest.spyOn(afterStudyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ afterStudy: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: afterStudy }));
      saveSubject.complete();

      // THEN
      expect(afterStudyFormService.getAfterStudy).toHaveBeenCalled();
      expect(afterStudyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAfterStudy>>();
      const afterStudy = { id: 123 };
      jest.spyOn(afterStudyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ afterStudy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(afterStudyService.update).toHaveBeenCalled();
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
  });
});
