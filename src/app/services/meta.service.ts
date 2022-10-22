import { Injectable } from '@angular/core';
import { Title, Meta as MetaService } from '@angular/platform-browser';

export interface MetaData {
  title: string;
  desc?: string | null;
  noIndex?: boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class Meta {
  constructor(private _title: Title, private _meta: MetaService) {}

  /**
   * @param metaData - メタデータ
   *
   *   - null: メタタグを削除
   *   - undefined: メタタグを更新しない
   */
  update(metaData: MetaData): void {
    this._title.setTitle(metaData.title);

    const meta = this._meta;

    const desc = metaData.desc;
    if (desc !== void 0) {
      desc
        ? meta.updateTag({ name: 'description', content: desc })
        : meta.removeTag('name="description"');
    }

    if (metaData.noIndex !== void 0) {
      metaData.noIndex
        ? meta.updateTag({ name: 'robots', content: 'noindex' })
        : meta.removeTag('name=robots');
    }
  }
}
