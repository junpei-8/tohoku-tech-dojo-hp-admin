import { Location } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';

export const SIGN_IN_PAGE_PATHNAME = '/sign-in' as const;

export type NavigateSignInPage = () => Promise<boolean>;

export const NAVIGATE_SIGN_IN_PAGE = new InjectionToken<NavigateSignInPage>(
  'It Can navigate to sign in page',
  {
    providedIn: 'root',
    factory: () => {
      const router = inject(Router);
      const location = inject(Location);

      return async () => {
        // 既にサインインページにいる場合は何もしない
        if (location.path() === SIGN_IN_PAGE_PATHNAME) return true;

        return router.navigate([SIGN_IN_PAGE_PATHNAME]);
      };
    },
  },
);
