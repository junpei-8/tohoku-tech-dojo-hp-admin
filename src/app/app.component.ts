import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { RouteData } from './app-routing.module';
import { Meta } from './services/meta.service';
import { RouteChanges, ROUTE_CHANGES } from './services/route-changes.service';
import {
  YoungestRoute,
  YOUNGEST_ROUTE,
} from './services/youngest-route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  youngestRouteData: RouteData | null = null;

  hasOpenedDrawer = true;

  constructor(
    // changeDetector: ChangeDetectorRef,
    _meta: Meta,
    @Inject(ROUTE_CHANGES) routeChanges: RouteChanges,
    @Inject(YOUNGEST_ROUTE) youngestRoute: YoungestRoute,
  ) {
    routeChanges.subscribe(() => {
      const data = youngestRoute.ref.snapshot.data as RouteData;

      this.youngestRouteData = data;

      _meta.update(data.meta);
    });
  }

  ngOnInit(): void {
    console.log('on init');
  }
}
