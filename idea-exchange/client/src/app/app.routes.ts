import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { Login } from './feature/auth/components/login/login';
import { Register } from './feature/auth/components/register/register';
import { PostsList } from './feature/posts/components/posts-list/posts-list';
import { PostForm } from './feature/posts/components/post-form/post-form';
import { NotFound } from './core/components/not-found/not-found';
import { UserComments } from './feature/posts/components/user-comments/user-comments';
import { PostDetails } from './feature/posts/components/post-details/post-details';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'posts',
    component: PostsList,
  },
  {
    path: 'user/posts',
    component: PostsList,
  },
  {
    path: 'user/comments',
    component: UserComments,
  },
  {
    path: 'posts/create',
    component: PostForm,
  },
  {
    path: 'posts/edit',
    component: PostForm,
  },
  {
    path: 'posts/:id',
    component: PostDetails,
  },
  {
    path: '**',
    component: NotFound,
  },
];
