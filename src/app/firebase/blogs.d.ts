/** @key year - 年 */
export interface BlogsDoc {
  [uid: string]: {
    /** uid */
    id: string;

    /** タイトル */
    title: string;

    /** 内容（HTML） */
    content: string;

    /** タグ */
    tags: string[];

    /** 著者 */
    author: string;

    /** 作成日 */
    createdAt: string;

    /** 更新日 */
    updatedAt: string;

    /** 削除日 */
    deletedAt: string | null;
  };
}
