import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { PostPhotoService } from '../services/post-photo.service';
import { AuthService } from '../../auth/services/auth.service';
import { PostPhotoDto } from '../models/add-post-photo.model';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
   post: Post | null = null; // Use your Post model instead of any
  postImages: string[] = [];
  postFiles: { name: string; content: string; type: string }[] = [];
  isModalOpen: boolean = false;
  selectedImage: string = '';
  currentImageIndex: number = 0;
  canEditPost: boolean = false; 
  isEditModalOpen: boolean = false;
  selectedPost: Post | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private postPhotoService: PostPhotoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(postId).subscribe((data: Post) => {
        this.post = data;
        this.loadFilesForPost(postId); // Load images and files after post data is loaded
        this.checkEditPermission(); // Check if the user can edit the post
      });
    }
  }

  loadFilesForPost(postId: string): void {
    this.postPhotoService.getPhotosByPostId(postId).subscribe((files: PostPhotoDto[]) => {
      this.postImages = [];
      this.postFiles = [];

      files.forEach((file: PostPhotoDto) => {
        const byteCharacters = atob(file.PhotoContent);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: file.FileType });
        const url = URL.createObjectURL(blob);

        if (file.IsImage === 1) {
          this.postImages.push(url);
        } else {
          this.postFiles.push({ name: file.FileName, content: url, type: file.FileType });
        }
      });
    }, (error) => {
      console.error('Error fetching images:', error);
    });
  }

  checkEditPermission(): void {
    const currentUserId = this.authService.getUserIdFromToken();
    const currentUserRole = this.authService.getRoleFromToken();

    if (this.post && currentUserId) {
        this.canEditPost = (currentUserId === this.post.UserId || currentUserRole === 'admin');
    } else {
        this.canEditPost = false;
    }
}

  openImage(image: string) {
    this.selectedImage = image;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.postImages.length;
  }

  previousImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.postImages.length) % this.postImages.length;
  }

  openEditPostModal(post: Post) {
    this.selectedPost = post;
    this.isEditModalOpen = true;
  }

  closeEditPostModal() {
    this.isEditModalOpen = false;
    this.selectedPost = null;
  }

  handlePostUpdated(event: any): void { // Use 'any' or a more appropriate type if needed
    const updatedPost = event as Post; // Cast it to 'Post' if you know it's of this type
  
    if (updatedPost) {
      this.post = updatedPost;
      this.closeEditPostModal();
    } else {
      console.error('Updated post is null or invalid');
    }

    this.closeEditPostModal();
  }
  
}
