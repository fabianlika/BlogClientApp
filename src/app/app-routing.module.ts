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
import { UploadPostPhotoComponent } from './features/blog-post/post-photo/upload-post-photo/upload-post-photo.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard'; // Import the AuthGuard
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MyProfileComponent } from './features/user/my-profile/my-profile.component';
import { PostsTableComponent } from './features/blog-post/posts-table/posts-table.component';
import { PostPageComponent } from './features/blog-post/post-page/post-page.component';
import { EditPostComponent } from './features/blog-post/edit-post/edit-post.component';

const routes: Routes = [
  {
    path: 'admin/categories',
    component: CategoryListComponent,
  //  canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'admin/categories/add',
    component: AddCategoryComponent,
  //  canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'admin/categories/:id',
    component: EditCategoryComponent,
   // canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'admin/blogposts',
    component: PostListComponent,
   // canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'admin/blogposts/add',
    component: AddPostComponent,
  //  canActivate: [AuthGuard] // Protect this route
  },
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'user-list',
    component: UserListComponent,
  //  canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'user-roles',
    component: UserRoleComponent,
   // canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'posts',
    component: PostListComponent,
   // canActivate: [AuthGuard] // Protect this route
  },

  {
    path: 'my-profile',
    component: MyProfileComponent,
   // canActivate: [AuthGuard] // Protect this route
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'posts-table',
    component: PostsTableComponent
  },

  {
    path: 'posts/:id',
    component: PostPageComponent
  },
  {
    path: 'edit-post',
    component: EditPostComponent
  },


  {
    path: 'add-photo',
    component: UploadPostPhotoComponent,
    //canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'login',
    component: LoginComponent // Login route
  },
  {
    path: 'signup',
    component: SignupComponent // Sign-up route
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
