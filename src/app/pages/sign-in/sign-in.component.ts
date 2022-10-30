import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RootView } from 'src/app/root-view.service';
import { Authentication } from 'src/app/services/authentication.service';

@Component({
  standalone: true,
  selector: 'sign-in-page',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [CommonModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPageComponent {
  errorMessage: string | null = null;

  constructor(
    private _auth: Authentication,
    private _rootView: RootView,
    private _changeDetectorRef: ChangeDetectorRef,
    private _location: Location,
  ) {}

  async signInWithGoogle() {
    this.errorMessage = null;
    this._rootView.updateLoadingState(true);

    const status = await this._auth.signInWithGoogle();

    switch (status) {
      case 'SUCCESS':
        this._onSuccessSignIn();
        break;

      case 'NOT_ADMIN':
        this._onFailSignIn(
          '管理者権限を持つアカウントでサインインしてください。',
        );
        break;

      case 'ERROR':
        this._onFailSignIn('サインインに失敗しました。');
        break;

      case 'CANCEL':
        this._onFailSignIn('サインインをキャンセルしました。');
        break;
    }
  }

  private _onSuccessSignIn() {
    this._rootView.updateLoadingState(false);
    this._location.back();
  }

  private _onFailSignIn(errorMessage: this['errorMessage']) {
    this.errorMessage = errorMessage;
    this._rootView.updateLoadingState(false);
    this._changeDetectorRef.detectChanges();
  }
}
