import { NgModule } from '@angular/core';
import { RouterModule, Route as BaseRoute } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { MetaData } from './services/meta.service';

export interface RouteData {
  key: string;
  meta: MetaData;
}

export interface Route extends BaseRoute {
  data: RouteData;
}

export type Routes = Route[];

const TITLE_SUFFIX = '東北TECH道場 ホームページ管理画面' as const;
const DESC_SUFFIX = '東北TECH道場のホームページの管理画面' as const;

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: {
      key: 'home',
      meta: {
        title: `ホーム | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/list/list.component').then(
        (m) => m.BlogListPageComponent,
      ),
    data: {
      key: 'blog/list',
      meta: {
        title: `ブログ一覧 | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
  },
  {
    path: 'blog/editor',
    loadComponent: () =>
      import('./pages/blog/editor/editor.component').then(
        (m) => m.BlogEditorPageComponent,
      ),
    data: {
      key: 'blog/editor',
      meta: {
        title: `ブログ編集 | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./pages/news/list/list.component').then(
        (m) => m.NewsListPageComponent,
      ),
    data: {
      key: 'news/list',
      meta: {
        title: `お知らせ一覧 | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
  },
  {
    path: 'news/editor',
    loadComponent: () =>
      import('./pages/news/editor/editor.component').then(
        (m) => m.NewsEditorPageComponent,
      ),
    data: {
      key: 'news/editor',
      meta: {
        title: `お知らせ編集 | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
