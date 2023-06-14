import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LeagueTableDetailComponent } from './league-table-detail.component';

describe('LeagueTable Management Detail Component', () => {
  let comp: LeagueTableDetailComponent;
  let fixture: ComponentFixture<LeagueTableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueTableDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ leagueTable: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LeagueTableDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LeagueTableDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load leagueTable on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.leagueTable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
