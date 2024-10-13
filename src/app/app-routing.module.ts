import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { PostListComponent } from './features/blog-post/post-list/post-list.component';
import { AddPostComponent } from './features/blog-post/add-post/add-post.component';
import { HomepageComponent } from './features/homepage/homepage/homepage.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { UserRoleComponent } from './features/user-role/user-role/user-role.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard'; 
import { AdminGuard } from './core/guards/admin.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MyProfileComponent } from './features/user/my-profile/my-profile.component';
import { PostsTableComponent } from './features/blog-post/posts-table/posts-table.component';
import { PostPageComponent } from './features/blog-post/post-page/post-page.component';
import { EditPostComponent } from './features/blog-post/edit-post/edit-post.component';
import { UserPostsComponent } from './features/blog-post/user-posts/user-posts.component';

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
    canActivate: [AdminGuard]
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
    path: 'user-roles',
    component: UserRoleComponent,
    canActivate: [AdminGuard]
  },

  {
    path: 'user-posts',
    component: UserPostsComponent,
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
    path: 'dashboard',
    component: DashboardComponent
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
    redirectTo: '' // Redirect unknown routes to the homepage
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
