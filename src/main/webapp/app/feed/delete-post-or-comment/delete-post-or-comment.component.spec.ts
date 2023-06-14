import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePostOrCommentComponent } from './delete-post-or-comment.component';

describe('DeletePostOrCommentComponent', () => {
  let component: DeletePostOrCommentComponent;
  let fixture: ComponentFixture<DeletePostOrCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePostOrCommentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePostOrCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
