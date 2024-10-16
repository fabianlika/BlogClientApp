import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { PostListComponent } from './features/blog-post/post-list/post-list.component';
import { AddPostComponent } from './features/blog-post/add-post/add-post.component';
import { HomepageComponent } from './features/homepage/homepage/homepage.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard'; 
import { AdminGuard } from './core/guards/admin.guard';
import { MyProfileComponent } from './features/user/my-profile/my-profile.component';
import { PostsTableComponent } from './features/blog-post/posts-table/posts-table.component';
import { PostPageComponent } from './features/blog-post/post-page/post-page.component';
import { EditPostComponent } from './features/blog-post/edit-post/edit-post.component';
import { UserPostsComponent } from './features/blog-post/user-posts/user-posts.component';
import { RandomUserPostsComponent } from './features/blog-post/random-user-posts/random-user-posts.component';
import { UnauthorizedAccessComponent } from './features/user/unauthorized-access/unauthorized-access.component';

const routes: Routes = [
  {
    path: 'admin/categories',
    component: CategoryListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/categories/add',
    component: AddCategoryComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/categories/:id',
    component: EditCategoryComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/blogposts',
    component: PostListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/blogposts/add',
    component: AddPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedAccessComponent,
  },
  {
    path: 'user-posts/:id',
    component: UserPostsComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'random-user-posts/:userId',
    component: RandomUserPostsComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'posts',
    component: PostListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'posts-table',
    component: PostsTableComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'posts/:id',
    component: PostPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-post',
    component: EditPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent 
  },
  {
    path: '**',
    redirectTo: 'unauthorized' // Redirect unknown routes to the unauthorized page
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
