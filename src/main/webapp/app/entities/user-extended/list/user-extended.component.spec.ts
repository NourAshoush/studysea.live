import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserExtendedService } from '../service/user-extended.service';

import { UserExtendedComponent } from './user-extended.component';

describe('UserExtended Management Component', () => {
  let comp: UserExtendedComponent;
  let fixture: ComponentFixture<UserExtendedComponent>;
  let service: UserExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-extended', component: UserExtendedComponent }]), HttpClientTestingModule],
      declarations: [UserExtendedComponent],
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
      .overrideTemplate(UserExtendedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExtendedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserExtendedService);

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
    expect(comp.userExtendeds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userExtendedService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserExtendedIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserExtendedIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
