import { Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
import { auth, AdminsDoc } from '@/app/firebase';

@Injectable({ providedIn: 'root' })
export class Authentication {
  constructor(private _firestore: Firestore) {}

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      const user = result.user;
      if (!user) return 'ERROR';

      // 認証済みユーザーではない場合、ユーザーを削除しエラーステータスを返す
      try {
        // ユーザーが管理者権限を保持していないのでれば、登録したアカウントを削除
        if (!(await this.isAdminUser(user.email))) {
          this.deleteUser(user);
          return 'NOT_ADMIN';
        }
      } catch {
        return 'ERROR';
      }

      return 'SUCCESS';

      // 以下のエラーはサインインをキャンセルした時などに発火する
    } catch {
      return 'CANCEL';
    }
  }

  async isAdminUser(email: string | null) {
    if (!email) return false;

    const docRef = doc(this._firestore, 'admins', email);

    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  }

  async setUserDoc(email: string, userDoc: AdminsDoc) {
    const docRef = doc(this._firestore, 'admins', email);
    await setDoc(docRef, userDoc);
  }

  async deleteUser(user: User) {
    await signOut(auth);
    return user.delete();
  }
}
