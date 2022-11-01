# Memo

## 戦略

1. [markdown-wasm](https://github.com/rsms/markdown-wasm) リポジトリをクローン
2. wasmc.js を書き換える or 別ファイルを用意し worker 用のファイルを生成する

## ビルド設定参考

- https://github.com/rsms/js-wasmc/blob/master/misc/config-file.d.ts

**例**

```js
module({
  ...m,
  name: 'markdown-worker',
  out: outdir + '/markdown.worker.js',
  target: 'worker',
  embed: true,
});
```
