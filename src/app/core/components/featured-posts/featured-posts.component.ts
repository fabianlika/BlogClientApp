import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { PostPhotoService } from 'src/app/features/blog-post/services/post-photo.service';
import { Post } from 'src/app/features/blog-post/models/post.model';
import { PostPhotoDto } from 'src/app/features/blog-post/models/add-post-photo.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-featured-posts',
  templateUrl: './featured-posts.component.html',
  styleUrls: ['./featured-posts.component.css']
})
export class FeaturedPostsComponent implements OnInit {
  featuredPosts: Post[] = [];
  filteredPosts: Post[] = []; // Array to hold posts with images
  postImages: { [key: string]: string[] } = {};
  currentIndex: number = 0;  // Tracks the active carousel item
  postsPerPage: number = 3;   // Number of posts to display at once

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService,
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedPosts();
  }

  loadFeaturedPosts(): void {
    this.postService.getAllPosts().subscribe((data: Post[]) => {
      this.featuredPosts = data;
      this.featuredPosts.forEach(post => this.loadImagesForPost(post.PostId));
    }, (error) => {
      console.error('Error loading featured posts:', error);
    });
  }

  viewPost(postId: string): void {
    if (this.authService.isLoggedIn()) { // Check if user is logged in
      this.router.navigate(['/posts', postId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadImagesForPost(postId: string): void {
    this.postPhotoService.getPhotosByPostId(postId).subscribe((files: PostPhotoDto[]) => {
      this.postImages[postId] = [];

      files.forEach((file: PostPhotoDto) => {
        const byteCharacters = atob(file.PhotoContent);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: file.FileType });
        const url = URL.createObjectURL(blob);

        if (file.IsImage === 1) {
          this.postImages[postId].push(url);
        }
      });

      // Check for images after loading them
      this.updateFilteredPosts();
    }, (error) => {
      console.error('Error fetching images for post:', error);
    });
  }

  // Update the filteredPosts array based on posts that have images
  updateFilteredPosts(): void {
    this.filteredPosts = this.featuredPosts.filter(post => this.hasImages(post.PostId));
  }

  // Check if the post has images
  hasImages(postId: string): boolean {
    return this.postImages[postId] && this.postImages[postId].length > 0;
  }

  // Get the current group of posts to display
  get displayedPosts(): Post[] {
    return this.filteredPosts.slice(this.currentIndex, this.currentIndex + this.postsPerPage);
  }

  // Move to the next group of posts
  nextGroup(): void {
    if (this.currentIndex + this.postsPerPage < this.filteredPosts.length) {
      this.currentIndex += this.postsPerPage;
    }
  }

  // Move to the previous group of posts
  previousGroup(): void {
    if (this.currentIndex - this.postsPerPage >= 0) {
      this.currentIndex -= this.postsPerPage;
    }
  }
}
