import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { User } from 'firebase/auth';
import { RootView } from '@/app/root-view.service';
import {
  NavigateSignInPage,
  NAVIGATE_SIGN_IN_PAGE,
} from '@/app/services/navigate-sign-in.service';
import { auth } from '../firebase';
import { hasFetchedUser } from '../utils/has-fetched-user';

@Injectable()
export class AuthGuard implements CanActivate {
  SIGN_IN_PAGE_PATHNAME = '/sign-in' as const;

  constructor(
    private _rootView: RootView,
    @Inject(NAVIGATE_SIGN_IN_PAGE)
    private _navigateSignInPage: NavigateSignInPage,
  ) {}

  canActivate(): Promise<boolean> | boolean {
    return hasFetchedUser.current
      ? this._shouldNavigateToSignInPage(auth.currentUser)
      : this._waitUntilUserStateGot();
  }

  /** ユーザーの状態が取得できるまで待機し、その後にサインイン済みかどうかを判定する */
  private _waitUntilUserStateGot() {
    this._rootView.loading = true;

    return new Promise<boolean>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        resolve(this._shouldNavigateToSignInPage(user));
        this._rootView.loading = false;
        unsubscribe();
      });
    });
  }

  /** ユーザーがサインイン済みかを判定し、未サインインだった場合は Sign-in ページへ遷移させる */
  private _shouldNavigateToSignInPage(user: User | null) {
    // サインイン済みの場合は true を返却
    if (user) return true;

    // 未サインインの場合はサインインページに遷移し false を返却
    this._navigateSignInPage();
    return false;
  }
}
