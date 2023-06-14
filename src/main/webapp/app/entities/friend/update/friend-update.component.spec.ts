import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FriendFormService } from './friend-form.service';
import { FriendService } from '../service/friend.service';
import { IFriend } from '../friend.model';
import { IUserExtended } from 'app/entities/user-extended/user-extended.model';
import { UserExtendedService } from 'app/entities/user-extended/service/user-extended.service';

import { FriendUpdateComponent } from './friend-update.component';

describe('Friend Management Update Component', () => {
  let comp: FriendUpdateComponent;
  let fixture: ComponentFixture<FriendUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let friendFormService: FriendFormService;
  let friendService: FriendService;
  let userExtendedService: UserExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FriendUpdateComponent],
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
      .overrideTemplate(FriendUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    friendFormService = TestBed.inject(FriendFormService);
    friendService = TestBed.inject(FriendService);
    userExtendedService = TestBed.inject(UserExtendedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserExtended query and add missing value', () => {
      const friend: IFriend = { id: 456 };
      const friendshipFrom: IUserExtended = { id: 68819 };
      friend.friendshipFrom = friendshipFrom;
      const friendshipTo: IUserExtended = { id: 19694 };
      friend.friendshipTo = friendshipTo;

      const userExtendedCollection: IUserExtended[] = [{ id: 41761 }];
      jest.spyOn(userExtendedService, 'query').mockReturnValue(of(new HttpResponse({ body: userExtendedCollection })));
      const additionalUserExtendeds = [friendshipFrom, friendshipTo];
      const expectedCollection: IUserExtended[] = [...additionalUserExtendeds, ...userExtendedCollection];
      jest.spyOn(userExtendedService, 'addUserExtendedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ friend });
      comp.ngOnInit();

      expect(userExtendedService.query).toHaveBeenCalled();
      expect(userExtendedService.addUserExtendedToCollectionIfMissing).toHaveBeenCalledWith(
        userExtendedCollection,
        ...additionalUserExtendeds.map(expect.objectContaining)
      );
      expect(comp.userExtendedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const friend: IFriend = { id: 456 };
      const friendshipFrom: IUserExtended = { id: 6301 };
      friend.friendshipFrom = friendshipFrom;
      const friendshipTo: IUserExtended = { id: 14481 };
      friend.friendshipTo = friendshipTo;

      activatedRoute.data = of({ friend });
      comp.ngOnInit();

      expect(comp.userExtendedsSharedCollection).toContain(friendshipFrom);
      expect(comp.userExtendedsSharedCollection).toContain(friendshipTo);
      expect(comp.friend).toEqual(friend);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriend>>();
      const friend = { id: 123 };
      jest.spyOn(friendFormService, 'getFriend').mockReturnValue(friend);
      jest.spyOn(friendService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friend });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friend }));
      saveSubject.complete();

      // THEN
      expect(friendFormService.getFriend).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(friendService.update).toHaveBeenCalledWith(expect.objectContaining(friend));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriend>>();
      const friend = { id: 123 };
      jest.spyOn(friendFormService, 'getFriend').mockReturnValue({ id: null });
      jest.spyOn(friendService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friend: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friend }));
      saveSubject.complete();

      // THEN
      expect(friendFormService.getFriend).toHaveBeenCalled();
      expect(friendService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriend>>();
      const friend = { id: 123 };
      jest.spyOn(friendService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friend });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(friendService.update).toHaveBeenCalled();
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
