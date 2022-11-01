import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  Md2HtmlConverterRequest,
  Md2HtmlConverterResponse,
  createMd2HtmlConverter,
  createMd2HtmlConverterDataset,
  Md2HtmlConverterData,
} from './md2html-converter';

@Component({
  standalone: true,
  selector: 'news-editor-page',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsEditorPageComponent {
  title = '';

  tags: string[] = [];
  MAX_TAG_LENGTH = 5 as const;

  navLeftViewMode: 'tags' | 'settings' = 'settings';

  content = '';
  contentPreview: SafeHtml = '';

  CONTENT_INPUT_STYLES = [
    {
      fontFamily: 'Noto Sans Mono',
    },
    {
      fontFamily: 'Noto Sans JP',
      letterSpacing: '1.2px',
    },
  ] as const;
  selectedContentInputStyleIndex = 0;

  contentViewMode: 'both' | 'editor' | 'previewer' = 'both';

  md2HtmlConverterDataset = createMd2HtmlConverterDataset();
  selectedMd2HtmlConverterIndex: number;
  selectedMd2HtmlConverter: Md2HtmlConverterData;

  constructor(
    private _domSanitizer: DomSanitizer,
    private _changeDetectionRef: ChangeDetectorRef,
  ) {
    this.selectMd2HtmlConverter(0);
  }

  isDisabledAddTag(inputElement: HTMLInputElement) {
    const tags = this.tags;
    const value = inputElement.value.trim();

    return (
      !value ||
      tags.length >= this.MAX_TAG_LENGTH ||
      !!tags.find((tag) => tag === value.trim())
    );
  }

  addTag(inputElement: HTMLInputElement, event: Event) {
    event.preventDefault();

    if (!this.isDisabledAddTag(inputElement)) {
      event.stopPropagation(); // 追加時の input-form のフォーカスを制御

      this.navLeftViewMode = 'tags';
      this.tags.push(inputElement.value.trim());
      inputElement.value = '';
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  private _setContentPreview(content: string) {
    this.contentPreview = this._domSanitizer.bypassSecurityTrustHtml(content);
  }

  private _initMd2HtmlConverter() {
    const data =
      this.md2HtmlConverterDataset[this.selectedMd2HtmlConverterIndex];

    const worker = (data.worker = createMd2HtmlConverter[data.key]());

    worker.onmessage = ({ data }: Md2HtmlConverterResponse) => {
      this._changeDetectionRef.markForCheck();
      this._setContentPreview(data);
    };

    return worker;
  }

  selectMd2HtmlConverter(index: number) {
    this.selectedMd2HtmlConverterIndex = index;
    this.selectedMd2HtmlConverter = this.md2HtmlConverterDataset[index];
  }

  convertMdContent2Html(event: Event) {
    const worker = (this.selectedMd2HtmlConverter.worker ||=
      this._initMd2HtmlConverter());

    // 型キャスト
    const e = event as InputEvent;

    // 日本語入力中など input の値が確定していない場合、入力中のデータを取得し付け加える
    const inputtingContent = e.isComposing ? e.data || '' : '';

    const request: Md2HtmlConverterRequest['data'] =
      this.content + inputtingContent;

    worker.postMessage(request);
  }
}
