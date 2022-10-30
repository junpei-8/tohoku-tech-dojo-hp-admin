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
} from './md2html-converter';

@Component({
  standalone: true,
  selector: 'blog-editor-page',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
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
export class BlogEditorPageComponent {
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

  MD2HTML_CONVERTER_DATASET = [
    {
      key: 'pulldownCmark',
      label: 'Pulldown Cmark (Rust)',
    },
  ] as const;
  selectedMd2HtmlConverterIndex = 0;
  md2HtmlConverter: Worker | null = null;

  constructor(
    private _domSanitizer: DomSanitizer,
    private _changeDetectionRef: ChangeDetectorRef,
  ) {}

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
    console.log('initMd2HtmlConverter');

    const key =
      this.MD2HTML_CONVERTER_DATASET[this.selectedMd2HtmlConverterIndex].key;

    const worker = createMd2HtmlConverter[key]();

    worker.onmessage = ({ data }: Md2HtmlConverterResponse) => {
      this._changeDetectionRef.markForCheck();
      this._setContentPreview(data);
    };

    return worker;
  }

  convertMd2Html() {
    console.log('input', this.content);

    const worker = (this.md2HtmlConverter ||= this._initMd2HtmlConverter());

    const request: Md2HtmlConverterRequest['data'] = this.content;

    worker.postMessage(request);
  }
}
