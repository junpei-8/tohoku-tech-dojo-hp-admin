import { inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTE_CHANGES } from './route-changes.service';

interface MutableYoungestRoute {
  ref: ActivatedRoute;
}

export type YoungestRoute = Readonly<MutableYoungestRoute>;

export const YOUNGEST_ROUTE = new InjectionToken<YoungestRoute>(
  'It youngest route',
  {
    providedIn: 'root',
    factory: () => {
      const activatedRoute = inject(ActivatedRoute);
      const youngestRoute: MutableYoungestRoute = { ref: activatedRoute };

      inject(ROUTE_CHANGES).subscribe(() => {
        let route: ActivatedRoute = activatedRoute;

        while (route.firstChild) {
          route = route.firstChild;
        }

        youngestRoute.ref = route;
      });

      return youngestRoute;
    },
  },
);
