import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { PostPhotoService } from '../services/post-photo.service';
import { PostPhotoDto } from '../models/add-post-photo.model';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4; // Display 4 items per page
  postImages: { [key: string]: string[] } = {}; // Store images for each post

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private postPhotoService: PostPhotoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserPosts();
  }

  loadUserPosts(): void {
    const userId = this.authService.getUserIdFromToken(); // Get logged-in user's ID
    this.postService.getAllPosts().subscribe((data) => {
      // Filter posts to only include those created by the logged-in user
      this.posts = data.filter(post => post.UserId === userId);
      this.filteredPosts = [...this.posts]; // Initialize filteredPosts with user posts

      // Sort posts by CreatedAt (most recent first)
      this.posts.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

      this.posts.forEach(post => {
        this.loadImagesForPost(post.PostId);
      });
    });
  }

  loadImagesForPost(postId: string): void {
    this.postPhotoService.getPhotosByPostId(postId).subscribe((images: PostPhotoDto[]) => {
      this.postImages[postId] = []; // Initialize image array for the post

      images.forEach((img: PostPhotoDto) => {
        if (img.IsImage === 1) {
          const byteCharacters = atob(img.PhotoContent);
          const byteNumbers = new Uint8Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteNumbers], { type: img.FileType });
          const reader = new FileReader();

          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              this.postImages[postId].push(reader.result); // Add image URL to the post
            }
          };
          reader.readAsDataURL(blob);
        }
      });
    }, (error) => {
      console.error('Error fetching images:', error);
    });
  }

  onSearch(): void {
    this.filteredPosts = this.posts.filter(post =>
      post.Title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  viewPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPosts.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }
}
