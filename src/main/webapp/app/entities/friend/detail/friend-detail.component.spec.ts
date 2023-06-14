import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FriendDetailComponent } from './friend-detail.component';

describe('Friend Management Detail Component', () => {
  let comp: FriendDetailComponent;
  let fixture: ComponentFixture<FriendDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ friend: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FriendDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FriendDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load friend on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.friend).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
