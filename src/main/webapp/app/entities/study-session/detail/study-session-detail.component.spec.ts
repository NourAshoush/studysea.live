import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudySessionDetailComponent } from './study-session-detail.component';

describe('StudySession Management Detail Component', () => {
  let comp: StudySessionDetailComponent;
  let fixture: ComponentFixture<StudySessionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudySessionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ studySession: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StudySessionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StudySessionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load studySession on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.studySession).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
