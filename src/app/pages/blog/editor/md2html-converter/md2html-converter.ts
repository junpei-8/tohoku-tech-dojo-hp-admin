export const createMd2HtmlConverter = {
  pulldownCmark: () =>
    new Worker(new URL('./pulldown-cmark.worker.ts', import.meta.url)),
} as const;
