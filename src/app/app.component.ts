import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { RouteData } from './app-routing.module';
import { auth } from './firebase';
import { RootView } from './root-view.service';
import { Meta } from './services/meta.service';
import {
  NavigateSignInPage,
  NAVIGATE_SIGN_IN_PAGE,
} from './services/navigate-sign-in.service';
import { RouteChanges, ROUTE_CHANGES } from './services/route-changes.service';
import {
  YoungestRoute,
  YOUNGEST_ROUTE,
} from './services/youngest-route.service';
import { hasFetchedUser } from './utils/has-fetched-user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  youngestRouteData: RouteData | null = null;

  hasOpenedDrawer = true;

  get currentUser() {
    return auth.currentUser;
  }

  constructor(
    _meta: Meta,
    public view: RootView,
    changeDetectorRef: ChangeDetectorRef,
    @Inject(NAVIGATE_SIGN_IN_PAGE)
    private _navigateSignInPage: NavigateSignInPage,
    @Inject(ROUTE_CHANGES) routeChanges: RouteChanges,
    @Inject(YOUNGEST_ROUTE) youngestRoute: YoungestRoute,
  ) {
    view.changeDetectorRef = changeDetectorRef;

    // ユーザーが変更を監視
    auth.onAuthStateChanged(() => changeDetectorRef.markForCheck());

    // ルートの変更を監視
    routeChanges.subscribe(() => {
      const data = youngestRoute.ref.snapshot.data as RouteData;

      this.youngestRouteData = data;

      if (data.meta) _meta.update(data.meta);
    });
  }

  toggleAuth() {
    if (hasFetchedUser) auth.signOut();

    this._navigateSignInPage();
  }
}
