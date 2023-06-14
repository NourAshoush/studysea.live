import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LeagueTableService } from '../service/league-table.service';

import { LeagueTableComponent } from './league-table.component';

describe('LeagueTable Management Component', () => {
  let comp: LeagueTableComponent;
  let fixture: ComponentFixture<LeagueTableComponent>;
  let service: LeagueTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'league-table', component: LeagueTableComponent }]), HttpClientTestingModule],
      declarations: [LeagueTableComponent],
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
      .overrideTemplate(LeagueTableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeagueTableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LeagueTableService);

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
    expect(comp.leagueTables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to leagueTableService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLeagueTableIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLeagueTableIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
