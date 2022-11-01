/// <reference lib="webworker" />

import { Md2HtmlConverterRequest } from './worker';

const BASE_URL = 'wasm/md2html-converter/pulldown-cmark/pkg' as const;

importScripts(`${BASE_URL}/pulldown_cmark.js`);
const { convert_markdown_to_html } = wasm_bindgen;

let hasInitialized = false;
const initializing = wasm_bindgen(`${BASE_URL}/pulldown_cmark_bg.wasm`);

addEventListener('message', async ({ data }: Md2HtmlConverterRequest) => {
  if (!hasInitialized) {
    await initializing;
    hasInitialized = true;
  }

  postMessage(convert_markdown_to_html(data));
});
