import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmExitComponent } from './confirm-exit.component';

describe('ConfirmExitComponent', () => {
  let component: ConfirmExitComponent;
  let fixture: ComponentFixture<ConfirmExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmExitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
