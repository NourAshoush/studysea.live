import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueTablesComponent } from './league-tables.component';

describe('LeagueTablesComponent', () => {
  let component: LeagueTablesComponent;
  let fixture: ComponentFixture<LeagueTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeagueTablesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
