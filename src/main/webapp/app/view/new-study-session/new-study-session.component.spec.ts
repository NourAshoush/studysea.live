import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudySessionComponent } from './new-study-session.component';

describe('NewStudySessionComponent', () => {
  let component: NewStudySessionComponent;
  let fixture: ComponentFixture<NewStudySessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewStudySessionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewStudySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
