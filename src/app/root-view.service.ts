import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RootView {
  loading = false;

  changeDetectorRef: ChangeDetectorRef = null!;

  updateLoadingState(loading: boolean) {
    this.loading = loading;
    this.changeDetectorRef.markForCheck();
  }
}
