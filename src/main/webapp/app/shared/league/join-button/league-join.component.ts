import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-league-join',
  templateUrl: './league-join.component.html',
  styleUrls: ['./league-join.component.scss'],
})
export class LeagueJoinComponent {
  joinLeagueForm = this.formBuilder.group({
    code: '',
  });

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  joinLeague(): void {
    const msg: string = <string>this.joinLeagueForm.value.code;
    this.router.navigate(['league', 'join', msg]);
  }
}
