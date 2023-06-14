import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AfterStudyService } from '../service/after-study.service';

import { AfterStudyComponent } from './after-study.component';

describe('AfterStudy Management Component', () => {
  let comp: AfterStudyComponent;
  let fixture: ComponentFixture<AfterStudyComponent>;
  let service: AfterStudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'after-study', component: AfterStudyComponent }]), HttpClientTestingModule],
      declarations: [AfterStudyComponent],
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
      .overrideTemplate(AfterStudyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AfterStudyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AfterStudyService);

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
    expect(comp.afterStudies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to afterStudyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAfterStudyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAfterStudyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
