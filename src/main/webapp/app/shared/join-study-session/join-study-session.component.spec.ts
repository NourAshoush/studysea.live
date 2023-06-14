import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinStudySessionComponent } from './join-study-session.component';

describe('JoinStudySessionComponent', () => {
  let component: JoinStudySessionComponent;
  let fixture: ComponentFixture<JoinStudySessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinStudySessionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinStudySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
