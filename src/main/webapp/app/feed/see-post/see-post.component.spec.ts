import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePostComponent } from './see-post.component';

describe('SeePostComponent', () => {
  let component: SeePostComponent;
  let fixture: ComponentFixture<SeePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeePostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
