import { NgModule } from '@angular/core';
import { RouterModule, Route as BaseRoute } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomePageComponent } from './pages/home/home.component';
import { MetaData } from './services/meta.service';

export interface RouteData {
  key: string;
  meta?: MetaData;
}

export interface Route extends BaseRoute {
  data: RouteData;
}

export type Routes = Route[];

const TITLE_SUFFIX = '東北TECH道場 ホームページ管理画面' as const;
const DESC_SUFFIX = '東北TECH道場のホームページの管理画面' as const;

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    data: {
      key: 'home',
      meta: {
        title: `ホーム | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
  },
  {
    path: 'news/editor/:id',
    loadComponent: () =>
      import('./pages/news/editor/news.component').then(
        (m) => m.NewsEditorPageComponent,
      ),
    data: {
      key: 'news/editor',
      meta: {
        title: `お知らせ編集 | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'news/editor',
    loadComponent: () =>
      import('./pages/news/editor/news.component').then(
        (m) => m.NewsEditorPageComponent,
      ),
    data: {
      key: 'blog/editor',
      meta: {
        title: `お知らせ新規作成 | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(
        (m) => m.SignInPageComponent,
      ),
    data: {
      key: 'sign-in',
      meta: {
        title: `サインイン | ${TITLE_SUFFIX}`,
        desc: `${DESC_SUFFIX}`,
      },
    },
  },
  {
    path: '**',
    redirectTo: '/news',
    data: {
      key: 'news-redirect',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
