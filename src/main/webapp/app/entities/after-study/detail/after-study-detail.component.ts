import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAfterStudy } from '../after-study.model';

@Component({
  selector: 'jhi-after-study-detail',
  templateUrl: './after-study-detail.component.html',
})
export class AfterStudyDetailComponent implements OnInit {
  afterStudy: IAfterStudy | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ afterStudy }) => {
      this.afterStudy = afterStudy;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
