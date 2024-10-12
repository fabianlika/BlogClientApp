import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { PostListComponent } from './features/blog-post/post-list/post-list.component';
import { AddPostComponent } from './features/blog-post/add-post/add-post.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './features/category/confirm-dialog/confirm-dialog.component';  
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomepageComponent } from './features/homepage/homepage/homepage.component';
import { HeroComponent } from './core/components/hero/hero.component';
import { FeaturedPostsComponent } from './core/components/featured-posts/featured-posts.component';
import { AboutComponent } from './core/components/about/about.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { EditUserComponent } from './features/user/edit-user/edit-user.component';
import { UserRoleComponent } from './features/user-role/user-role/user-role.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { StripHtmlPipe } from './core/components/pipes/strip-html.pipe';
import { PaginationComponent } from './features/tablePagination/pagination/pagination.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MyProfileComponent } from './features/user/my-profile/my-profile.component';
import { PostsTableComponent } from './features/blog-post/posts-table/posts-table.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ImageModalComponent } from './features/blog-post/image-modal/image-modal.component';
import { PostPageComponent } from './features/blog-post/post-page/post-page.component';
import { EditPostComponent } from './features/blog-post/edit-post/edit-post.component';
import { AddUserComponent } from './features/user/add-user/add-user.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CategoryListComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    PostListComponent,
    AddPostComponent,
    ConfirmDialogComponent,
    HomepageComponent,
    HeroComponent,
    FeaturedPostsComponent,
    AboutComponent,
    FooterComponent,
    UserListComponent,
    EditUserComponent,
    UserRoleComponent,
    StripHtmlPipe,
    LoginComponent,
    DashboardComponent,
    MyProfileComponent,
    PostsTableComponent,
    ImageModalComponent,
    PostPageComponent,
    EditPostComponent,
  
    //SignupComponent,
     // Ensure PaginationComponent is declared here,
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    EditorModule,
    CKEditorModule,
    NgxPaginationModule,
    PaginationComponent,
    SignupComponent,
    ReactiveFormsModule,
    SlickCarouselModule , AddUserComponent,
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
