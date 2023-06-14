import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserSettingsService } from '../../shared/user-settings.service';
import { IUser } from '../../entities/user/user.model';
import { IUserExtended } from '../../entities/user-extended/user-extended.model';
import { HttpClient } from '@angular/common/http';
import toDataURL from 'qr-code-styling/lib/tools/toDataUrl';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  firstNameInit: string | null | undefined;
  lastNameInit: string | null | undefined;
  emailInit: string | null | undefined;
  descriptionInit: string | null | undefined;
  courseInit: string | null | undefined;
  institutionInit: string | null | undefined;
  privacyInit: boolean | null | undefined;
  themeInit: string | null | undefined;
  fontInit: string | null | undefined;
  fontSizeInit: string | null | undefined = 'Large';

  firstNameNew: string | null | undefined;
  lastNameNew: string | null | undefined;
  emailNew: string | null | undefined;
  descriptionNew: string | null | undefined;
  courseNew: string | null | undefined;
  institutionNew: string | null | undefined;
  privacyNew: boolean | null | undefined;
  themeNew: string | null | undefined;
  fontNew: string | null | undefined;
  fontSizeNew: string | null | undefined = 'Large';

  iUser: IUser;
  iUserExtended: IUserExtended;
  detailsChanged: boolean = false;
  validEmail: boolean = true;
  validFirstName: boolean = true;
  validLastName: boolean = true;

  constructor(@Inject(DOCUMENT) private document: Document, public userSettingsService: UserSettingsService, public http: HttpClient) {}

  ngOnInit(): void {
    // @ts-ignore
    this.http.get('/api/account').subscribe((iUser: IUser) => {
      // @ts-ignore
      this.http.get(`/api/user-extendeds/by-user/${iUser.id}`).subscribe((iUserExtended: IUserExtended) => {
        this.firstNameInit = this.firstNameNew = iUserExtended.firstName == null ? '' : iUserExtended.firstName;
        this.lastNameInit = this.lastNameNew = iUserExtended.lastName == null ? '' : iUserExtended.lastName;
        this.emailInit = this.emailNew = iUserExtended.email == null ? '' : iUserExtended.email;
        this.descriptionInit = this.descriptionNew = iUserExtended.description == null ? '' : iUserExtended.description;
        this.courseInit = this.courseNew = iUserExtended.course == null ? '' : iUserExtended.course;
        this.institutionInit = this.institutionNew = iUserExtended.institution == null ? '' : iUserExtended.institution;
        this.privacyInit = this.privacyNew = iUserExtended.privacy == null ? false : iUserExtended.privacy;
        this.themeInit = this.themeNew = iUserExtended.status == null ? '' : iUserExtended.status;
        this.fontInit = this.fontNew = iUserExtended.darkMode ? 'Open-Dyslexic' : 'Default';
        this.fontSizeInit = this.fontSizeNew = iUserExtended.privacy ? 'Large' : 'Default';

        this.iUser = iUser;
        this.iUserExtended = iUserExtended;
      });
    });

    this.userSettingsService.setDisplayOnInit();
  }

  setTheme(): void {
    this.checkIfDetailsChanged();
    if (this.themeNew === 'Dark') {
      this.document.documentElement.classList.add('dark-theme');
      this.document.documentElement.classList.remove('high-contrast');
    } else if (this.themeNew === 'High Contrast') {
      this.document.documentElement.classList.add('high-contrast');
      this.document.documentElement.classList.remove('dark-theme');
    } else {
      this.document.documentElement.classList.remove('dark-theme');
      this.document.documentElement.classList.remove('high-contrast');
    }
  }

  setFont(): void {
    this.checkIfDetailsChanged();
    if (this.fontNew === 'Open-Dyslexic') {
      this.document.documentElement.classList.add('open-dyslexic');
    } else {
      this.document.documentElement.classList.remove('open-dyslexic');
    }
  }
  setFontSize(): void {
    this.checkIfDetailsChanged();
    const rootElement = document.documentElement;

    if (this.fontSizeNew === 'Large') {
      rootElement.style.fontSize = 'calc(1rem + 6px)';
    } else if (this.fontSizeNew === 'Default') {
      rootElement.style.fontSize = '1rem';
    }
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // @ts-ignore
    return (this.validEmail = this.emailNew === '' || emailRegex.test(this.emailNew));
  }

  isValidFirstName(): boolean {
    return (this.validFirstName = this.firstNameNew != '');
  }

  isValidLastName(): boolean {
    return (this.validLastName = this.lastNameNew != '');
  }

  checkIfDetailsChanged(): void {
    this.detailsChanged = !(
      this.firstNameNew === this.firstNameInit &&
      this.lastNameNew === this.lastNameInit &&
      this.emailNew === this.emailInit &&
      this.descriptionNew === this.descriptionInit &&
      this.courseNew === this.courseInit &&
      this.institutionNew === this.institutionInit &&
      this.privacyNew === this.privacyInit &&
      this.themeNew === this.themeInit &&
      this.fontNew === this.fontInit &&
      this.fontSizeNew === this.fontSizeInit
    );
    console.log('privacy new is ', this.privacyNew);
  }

  save(): void {
    if (!this.isValidEmail() || !this.isValidFirstName() || !this.isValidLastName()) {
      return;
    }
    this.detailsChanged = false;

    let putBody = {
      id: this.iUserExtended.id,
      firstName: this.firstNameNew,
      lastName: this.lastNameNew,
      email: this.emailNew,
      status: this.themeNew,
      institution: this.institutionNew,
      course: this.courseNew,
      description: this.descriptionNew,
      privacy: this.fontSizeNew == 'Large',
      darkMode: this.fontNew == 'Open-Dyslexic',
      user: this.iUserExtended.user,
      studySession: this.iUserExtended.studySession,
      leagues: this.iUserExtended.leagues,
    };

    this.http.put(`/api/user-extendeds/${this.iUserExtended.id}`, putBody).subscribe(() => {
      window.location.reload();
    });
  }
}
