import { inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTE_CHANGES } from './route-changes.service';

export interface YoungestRoute {
  ref: ActivatedRoute;
}
export const YOUNGEST_ROUTE = new InjectionToken('It youngest route', {
  providedIn: 'root',
  factory: () => {
    const activatedRoute = inject(ActivatedRoute);
    const youngestRoute = { ref: activatedRoute } as YoungestRoute;

    inject(ROUTE_CHANGES).subscribe(() => {
      let route: ActivatedRoute = activatedRoute;

      while (route.firstChild) {
        route = route.firstChild;
      }

      youngestRoute.ref = route;
    });

    return youngestRoute;
  },
});
