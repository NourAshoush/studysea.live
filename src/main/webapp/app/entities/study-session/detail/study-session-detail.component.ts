import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudySession } from '../study-session.model';

@Component({
  selector: 'jhi-study-session-detail',
  templateUrl: './study-session-detail.component.html',
})
export class StudySessionDetailComponent implements OnInit {
  studySession: IStudySession | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studySession }) => {
      this.studySession = studySession;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
