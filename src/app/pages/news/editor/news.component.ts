import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import apolloClient from '@/apollo';
import {
  Md2HtmlConverterRequest,
  Md2HtmlConverterResponse,
  createMd2HtmlConverter,
  createMd2HtmlConverterDataset,
  Md2HtmlConverterData,
} from './md2html-converter';
import { CreateNewsDocument } from './news';

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
    MatButtonModule,
    MatSnackBarModule,
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
  rawContentPreview = '';

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

  md2HtmlConverterDataset = createMd2HtmlConverterDataset();
  selectedMd2HtmlConverterIndex: number;
  selectedMd2HtmlConverter: Md2HtmlConverterData;

  savingNews = false;

  @ViewChild('contentTextarea', { read: ElementRef })
  private _contentTextareaElementRef: ElementRef<HTMLElement> | null;

  @ViewChild('contentPreviewer', { read: ElementRef })
  private _contentPreviewerElementRef: ElementRef<HTMLElement> | null;

  private _contentFormLastScrollTop: number | null = null;

  // 表示するモードが変更されたら scroll リスナーを変える
  private _contentFormViewMode: 'both' | 'editor' | 'previewer';
  set contentFormViewMode(mode: typeof this._contentFormViewMode) {
    const currMode = this._contentFormViewMode;
    if (currMode && (currMode === mode || !mode)) return;

    // 初期は undefined が代入されるので、初期化処理も含める
    this._contentFormViewMode = mode ||= 'both';

    // DOM のレンダリングが終わってから処理を行う
    setTimeout(() => {
      if (mode === 'both' || mode === 'editor') {
        this.forceListenResonanceScroll(
          this._contentTextareaElementRef,
          this._contentPreviewerElementRef,
        );
      }

      if (mode === 'both' || mode === 'previewer') {
        this.forceListenResonanceScroll(
          this._contentPreviewerElementRef,
          this._contentTextareaElementRef,
        );
      }
    });
  }
  get contentFormViewMode() {
    return this._contentFormViewMode;
  }

  constructor(
    private _domSanitizer: DomSanitizer,
    private _changeDetectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
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
    this.rawContentPreview = content;
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
    const content = (this.content = (event.target as HTMLInputElement).value);

    const worker = (this.selectedMd2HtmlConverter.worker ||=
      this._initMd2HtmlConverter());

    const request: Md2HtmlConverterRequest['data'] = content;

    worker.postMessage(request);
  }

  async createNews() {
    if (!this.title) return;

    this.savingNews = true;
    this._snackBar.open('ニュースを作成しています', 'OK');

    try {
      console.log('???');

      await apolloClient.mutate({
        mutation: CreateNewsDocument,
        variables: {
          userId: '2',
          html: this.rawContentPreview,
          markdown: this.content,
          title: this.title,
        },
      });

      this._snackBar.open('ニュースを作成しました', 'OK');
    } catch {
      this._snackBar.open('ニュースの作成に失敗しました', 'OK');
    }

    this.savingNews = false;
  }

  /** スクロールを共有する */
  resonanceScroll(src: HTMLElement, dest: HTMLElement) {
    if (src.scrollTop === this._contentFormLastScrollTop) return;

    const ratio = src.scrollTop / (src.scrollHeight - src.clientHeight);
    dest.scrollTop = (dest.scrollHeight - dest.clientHeight) * ratio;
    this._contentFormLastScrollTop = dest.scrollTop;

    console.log(src.classList[0]);
  }

  /** スクロールを共有するリスナーを onscroll に代入する */
  forceListenResonanceScroll(
    src: ElementRef<HTMLElement> | null,
    dest: ElementRef<HTMLElement> | null,
  ) {
    if (!src || !dest) return;

    const srcEl = src.nativeElement;
    const destEl = dest.nativeElement;
    srcEl.onscroll = () => this.resonanceScroll(srcEl, destEl);
    srcEl.oninput = () => this.resonanceScroll(srcEl, destEl);
  }
}
