import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmExitStudyComponent } from './confirm-exit-study.component';

describe('ConfirmExitStudyComponent', () => {
  let component: ConfirmExitStudyComponent;
  let fixture: ComponentFixture<ConfirmExitStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmExitStudyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmExitStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
