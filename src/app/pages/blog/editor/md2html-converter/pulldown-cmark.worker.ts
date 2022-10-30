/// <reference lib="webworker" />

import { Md2HtmlConverterRequest } from './worker';

importScripts('wasm/pulldown-cmark/pkg/pulldown_cmark.js');
const { convert_markdown_to_html } = wasm_bindgen;

const initializing = wasm_bindgen(
  'wasm/pulldown-cmark/pkg/pulldown_cmark_bg.wasm',
);

addEventListener('message', async ({ data }: Md2HtmlConverterRequest) => {
  await initializing;
  postMessage(convert_markdown_to_html(data));
});
