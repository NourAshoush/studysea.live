import { TestBed } from '@angular/core/testing';

import { StudyRoomService } from './study-room.service';

describe('StudyroomService', () => {
  let service: StudyRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
