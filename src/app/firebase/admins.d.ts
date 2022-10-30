/** @key email - Email */
export interface AdminsDoc {
  // uid
  uid: string;

  // email
  email: string;

  // 権限
  authority: 'admin' | 'editor' | 'viewer';
}
