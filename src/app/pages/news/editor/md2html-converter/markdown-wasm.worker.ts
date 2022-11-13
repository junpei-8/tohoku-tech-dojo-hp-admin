/// <reference lib="webworker" />

import { Md2HtmlConverterRequest } from './worker';

importScripts('wasm/md2html-converter/markdown-wasm/pkg/markdown.js'); // @ts-expect-error: test
const { parse } = self['markdown-worker'];

addEventListener('message', ({ data }: Md2HtmlConverterRequest) =>
  postMessage(parse(data.trim())),
);
