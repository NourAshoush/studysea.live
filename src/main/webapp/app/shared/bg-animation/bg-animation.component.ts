import { Component, Input } from '@angular/core';
import { AnimateService } from './animate.service';

@Component({
  selector: 'jhi-bg-animation',
  templateUrl: './bg-animation.component.html',
  styleUrls: ['./bg-animation.component.scss'],
})
export class BgAnimationComponent {
  @Input() reverseDirection: boolean;

  constructor(public animate: AnimateService) {}
}
