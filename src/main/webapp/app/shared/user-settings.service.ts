import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../entities/user/user.model';
import { IUserExtended } from '../entities/user-extended/user-extended.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient) {}

  setDisplayOnInit(): void {
    // @ts-ignore
    this.http.get('/api/account').subscribe((iUser: IUser) => {
      // @ts-ignore
      this.http.get(`/api/user-extendeds/by-user/${iUser.id}`).subscribe((iUserExtended: IUserExtended) => {
        if (iUserExtended.status === 'Dark') {
          this.document.documentElement.classList.add('dark-theme');
          this.document.documentElement.classList.remove('high-contrast');
        } else if (iUserExtended.status === 'High Contrast') {
          this.document.documentElement.classList.add('high-contrast');
          this.document.documentElement.classList.remove('dark-theme');
        } else {
          this.document.documentElement.classList.remove('dark-theme');
          this.document.documentElement.classList.remove('high-contrast');
        }

        if (iUserExtended.darkMode === true) {
          this.document.documentElement.classList.add('open-dyslexic');
        } else {
          this.document.documentElement.classList.remove('open-dyslexic');
        }
        if (iUserExtended.privacy === true) {
          this.document.documentElement.style.fontSize = 'calc(1rem + 6px)';
        } else {
          this.document.documentElement.style.fontSize = '1rem';
        }
      });
    });
  }
}
