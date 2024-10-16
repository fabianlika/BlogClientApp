import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import Quill from 'quill';
import { PostService } from '../services/post.service';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { CreatePostDto } from 'src/app/features/blog-post/models/create-post.dto.model';
import { Category } from 'src/app/features/category/models/category.model';
import { User } from '../../user/models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user/services/user.service';
import { PostPhotoService } from '../services/post-photo.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent implements OnInit, AfterViewInit {
  @ViewChild('postForm', { static: false }) postForm!: NgForm;
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;

  post: CreatePostDto = {
    Title: '',
    Content: '',
    Url: '',
    Author: '',
    CategoryId: '',
    UserId: '',
    isApproved: false // Initialize as false by default
  };
  categories: Category[] = [];
  users: User[] = [];
  selectedFiles: File[] = [];
  selectedCategory: string | null = null;
  isDropdownOpen: boolean = false;
  fileWarning: string = '';

  maxTitleLength = 100; 
  maxContentLength = 5000;
  maxFileSize = 5 * 1024 * 1024; // 5 MB
  quill: Quill | undefined;

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
    
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.post.UserId = userId;
      this.userService.getUserById(userId).subscribe(user => {
        this.post.Author = user.Name;
      });
    }
  }

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ]
      }
    });

    this.quill.on('text-change', () => {
      this.post.Content = this.quill?.root.innerHTML || '';
    });
  }

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
    this.post.CategoryId = category.CategoryId;
    this.isDropdownOpen = false;
  }

  async onSubmit() {
    if (this.post.Title.length > this.maxTitleLength) {
      this.snackBar.open(`Title cannot exceed ${this.maxTitleLength} characters.`, 'Close', { duration: 3000 });
      return;
    }

    if (this.post.Content.length > this.maxContentLength) {
      this.snackBar.open(`Content cannot exceed ${this.maxContentLength} characters.`, 'Close', { duration: 3000 });
      return;
    }

    const oversizedFiles = this.selectedFiles.filter(file => file.size > this.maxFileSize);
    if (oversizedFiles.length > 0) {
      this.snackBar.open(`Files cannot exceed ${this.maxFileSize / (1024 * 1024)} MB.`, 'Close', { duration: 3000 });
      return;
    }

    if (!this.post.Author) this.post.Author = 'Default Author';
    if (!this.post.Url) this.post.Url = 'http://defaulturl.com';

    const isAdmin = this.authService.isAdmin(); 
    this.post.isApproved = isAdmin;

    const postCreationData = new FormData();
    postCreationData.append('Title', this.post.Title || '');
    postCreationData.append('Content', this.post.Content || '');
    postCreationData.append('Url', this.post.Url || '');
    postCreationData.append('Author', this.post.Author || '');
    postCreationData.append('CategoryId', this.post.CategoryId || '');
    postCreationData.append('UserId', this.post.UserId || '');
    postCreationData.append('isApproved', this.post.isApproved.toString());

    try {
      const newPost = await this.postService.addPost(postCreationData).toPromise();
      this.snackBar.open('Post added successfully!', 'Close', { duration: 3000 });

      if (newPost && newPost.PostId && this.selectedFiles.length > 0) {
        for (const file of this.selectedFiles) {
          const photoFormData = new FormData();
          photoFormData.append('FileName', file.name);
          photoFormData.append('FileType', file.type);
          photoFormData.append('FileContent', file);
          photoFormData.append('PostId', newPost.PostId);
          const isImage = file.type.startsWith('image/') ? 1 : 0;
          photoFormData.append('IsImage', isImage.toString());

          try {
            await this.postPhotoService.uploadPostPhoto(photoFormData).toPromise();
          } catch (uploadError: any) {
            console.error('Error uploading photo:', uploadError);
            const errorMessage = uploadError?.message || 'Unknown error occurred';
            this.snackBar.open('Error uploading image: ' + errorMessage, 'Close', { duration: 3000 });
          }
        }
        this.snackBar.open('Images uploaded successfully!', 'Close', { duration: 3000 });
      }

      this.router.navigate(['/posts']);
    } catch (error: any) {
      if (error.status === 400 && error.error.errors) {
        console.error('Validation errors:', error.error.errors);
      }
      this.snackBar.open('Failed to add post or upload images. Please check your input.', 'Close', { duration: 3000 });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.fileWarning = ''; // Clear previous warnings

      for (const file of newFiles) {
        if (file.size > this.maxFileSize) {
          this.fileWarning = `${file.name} exceeds the 5MB size limit.`;
          return; // Exit if any file exceeds the limit
        }
      }

      this.selectedFiles = [...this.selectedFiles, ...newFiles];
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']); // Navigate back to the post list
  }
}
