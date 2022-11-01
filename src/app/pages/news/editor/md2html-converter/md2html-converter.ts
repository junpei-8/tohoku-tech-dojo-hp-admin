export const createMd2HtmlConverter = {
  pulldownCmark: () =>
    new Worker(new URL('./pulldown-cmark.worker.ts', import.meta.url)),

  markdownWasm: () =>
    new Worker(new URL('./markdown-wasm.worker.ts', import.meta.url)),
} as const;

export interface Md2HtmlConverterData {
  key: keyof typeof createMd2HtmlConverter;
  label: string;
  iconClass: string;
  worker?: Worker;
}

export function createMd2HtmlConverterDataset(): Md2HtmlConverterData[] {
  const ICON_CLASS = {
    rust: 'rust-icon',
  };

  return [
    {
      key: 'pulldownCmark',
      label: 'Pulldown cmark',
      iconClass: ICON_CLASS.rust,
    },
    {
      key: 'markdownWasm',
      label: 'Markdown wasm',
      iconClass: ICON_CLASS.rust,
    },
  ];
}
