import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AfterStudyDetailComponent } from './after-study-detail.component';

describe('AfterStudy Management Detail Component', () => {
  let comp: AfterStudyDetailComponent;
  let fixture: ComponentFixture<AfterStudyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfterStudyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ afterStudy: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AfterStudyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AfterStudyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load afterStudy on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.afterStudy).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
