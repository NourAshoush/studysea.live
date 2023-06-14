import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudySessionService } from '../service/study-session.service';

import { StudySessionComponent } from './study-session.component';

describe('StudySession Management Component', () => {
  let comp: StudySessionComponent;
  let fixture: ComponentFixture<StudySessionComponent>;
  let service: StudySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'study-session', component: StudySessionComponent }]), HttpClientTestingModule],
      declarations: [StudySessionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StudySessionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudySessionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StudySessionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.studySessions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to studySessionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStudySessionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStudySessionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
