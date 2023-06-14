import { TestBed } from '@angular/core/testing';

import { InitiateStudySessionService } from './initiate-study-session.service';

describe('InitiateStudySessionService', () => {
  let service: InitiateStudySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitiateStudySessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
