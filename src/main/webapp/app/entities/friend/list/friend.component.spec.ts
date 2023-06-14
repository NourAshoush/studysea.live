import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FriendService } from '../service/friend.service';

import { FriendComponent } from './friend.component';

describe('Friend Management Component', () => {
  let comp: FriendComponent;
  let fixture: ComponentFixture<FriendComponent>;
  let service: FriendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'friend', component: FriendComponent }]), HttpClientTestingModule],
      declarations: [FriendComponent],
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
      .overrideTemplate(FriendComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FriendService);

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
    expect(comp.friends?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to friendService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFriendIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFriendIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
