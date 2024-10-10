import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'; 
import { PostService } from '../services/post.service';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { CreatePostDto } from 'src/app/features/blog-post/models/create-post.dto.model';
import { Category } from 'src/app/features/category/models/category.model';
import { User } from '../../user/models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user/services/user.service';
import { CreatePostPhotoDto } from '../models/create-post-photo.dto.model';
import { PostPhotoService } from '../services/post-photo.service';
import { AuthService } from '../../auth/services/auth.service';

declare var tinymce: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent implements OnInit, AfterViewInit {
  @ViewChild('postForm', { static: false }) postForm!: NgForm;

  post: CreatePostDto = {
    Title: '',
    Content: '',
    Url: '',
    Author: '',
    CategoryId: '',
    UserId: ''
  };
  categories: Category[] = [];
  users: User[] = [];
  selectedFiles: File[] = [];

  selectedCategory: string | null = null;
  isDropdownOpen: boolean = false;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private userService: UserService,
    private postPhotoService: PostPhotoService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // Get the logged-in user's info and set Author and UserId
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.post.UserId = userId;
      
      //  userService can fetch user details by id
      this.userService.getUserById(userId).subscribe(user => {
        this.post.Author = user.Name;
      });
    }
  }


 /**
 * Fabjan Lika
 * 07/10/2024
 * implementimi i tinymce qe kemi perdorur per text editor
 */

  ngAfterViewInit(): void {
    tinymce.init({
      selector: 'textarea',
      plugins: 'link image lists',
      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | link image',
      height: 300,
      setup: (editor: any) => {
        editor.on('change', () => {
          this.post.Content = editor.getContent();
        });
      }
    });
  }


 /**
 * Fabjan Lika
 * 07/10/2024
 * metoda e nxjerrjes se kategorive
 */

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(category: any): void {
    this.selectedCategory = category.Name;
    this.post.CategoryId = category.CategoryId; // Set the selected category ID
    this.isDropdownOpen = false; // Close dropdown after selection
  }



  /**
 * Fabjan Lika
 * 08/10/2024
 * metoda e shtimit te nje postimi se bashku me foto
 */
  

  async onSubmit() {
    if (!this.post.Author) this.post.Author = 'Default Author';
    if (!this.post.Url) this.post.Url = 'http://defaulturl.com';
    
    console.log('Post Data:', this.post);
  
    const postCreationData = new FormData();
    postCreationData.append('Title', this.post.Title || '');
    postCreationData.append('Content', this.post.Content || '');
    postCreationData.append('Url', this.post.Url || '');
    postCreationData.append('Author', this.post.Author || '');
    postCreationData.append('CategoryId', this.post.CategoryId || '');
    postCreationData.append('UserId', this.post.UserId || '');
  
    try {
      // Step 1: Attempt to add the post
      const newPost = await this.postService.addPost(postCreationData).toPromise();
      this.snackBar.open('Post added successfully!', 'Close', { duration: 3000 });

      //console.log('New Post Created:', newPost);
   //   console.log('Selected Files Length:', this.selectedFiles.length);
      
      if (newPost && newPost.PostId && this.selectedFiles.length > 0) {
        console.log('Preparing to upload images...');
        for (const file of this.selectedFiles) {
            const photoFormData = new FormData();
            
            photoFormData.append('FileName', file.name);  // File name
            photoFormData.append('FileType', file.type);  // File type
            photoFormData.append('FileContent', file);     // Actual file content
            photoFormData.append('PostId', newPost.PostId); // PostId from the created post

            const isImage = file.type.startsWith('image/') ? 1 : 0;
            photoFormData.append('IsImage', isImage.toString());

            console.log('Photo Form Data:', photoFormData); // Log the form data
            
            try {
                await this.postPhotoService.uploadPostPhoto(photoFormData).toPromise();
                console.log(`Uploaded: ${file.name}`);
            } catch (uploadError: any) {
                console.error('Error uploading photo:', uploadError);
                const errorMessage = uploadError?.message || 'Unknown error occurred';
                this.snackBar.open('Error uploading image: ' + errorMessage, 'Close', { duration: 3000 });
            }
        }
        this.snackBar.open('Images uploaded successfully!', 'Close', { duration: 3000 });
      }
      
    } catch (error: any) {
      if (error.status === 400 && error.error.errors) {
        console.error('Validation errors:', error.error.errors);
      }
      this.snackBar.open('Failed to add post or upload images. Please check your input.', 'Close', { duration: 3000 });
    }
  }



  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    console.log('Selected Files:', this.selectedFiles); // Log selected files
  }
}
