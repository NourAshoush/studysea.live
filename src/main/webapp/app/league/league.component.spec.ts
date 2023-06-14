import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeagueComponent } from './league.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { of, Subject } from 'rxjs';
import { Router } from '@angular/router';

describe('LeagueComponent', () => {
  let component: LeagueComponent;
  let fixture: ComponentFixture<LeagueComponent>;
  let mockAccountService: AccountService;
  let mockRouter: Router;
  const account: Account = {
    activated: true,
    authorities: [],
    email: '',
    firstName: null,
    langKey: '',
    lastName: null,
    login: 'login',
    imageUrl: null,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [LeagueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueComponent);
    component = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
  });

  describe('ngOnInit', () => {
    it('Should synchronize account variable with current account', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(component.account).toEqual(account);

      // WHEN
      authenticationState.next(null);

      // THEN
      expect(component.account).toBeNull();
    });
  });

  describe('login', () => {
    it('Should navigate to /login on login', () => {
      // WHEN
      component.login();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('ngOnDestroy', () => {
    it('Should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(component.account).toEqual(account);

      // WHEN
      component.ngOnDestroy();
      authenticationState.next(null);

      // THEN
      expect(component.account).toEqual(account);
    });
  });
});

/*
it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
