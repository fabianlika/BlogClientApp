import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { PostPhotoService } from 'src/app/features/blog-post/services/post-photo.service';
import { Post } from 'src/app/features/blog-post/models/post.model';
import { PostPhotoDto } from 'src/app/features/blog-post/models/add-post-photo.model';

@Component({
  selector: 'app-featured-posts',
  templateUrl: './featured-posts.component.html',
  styleUrls: ['./featured-posts.component.css']
})
export class FeaturedPostsComponent implements OnInit {
  featuredPosts: Post[] = [];
  postImages: { [key: string]: string[] } = {};
  currentIndex: number = 0;  // Tracks the active carousel item
  postsPerPage: number = 3;   // Number of posts to display at once

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService
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
    }, (error) => {
      console.error('Error fetching images for post:', error);
    });
  }

  // Get the current group of posts to display
  get displayedPosts(): Post[] {
    return this.featuredPosts.slice(this.currentIndex, this.currentIndex + this.postsPerPage);
  }

  // Move to the next group of posts
  nextGroup(): void {
    if (this.currentIndex + this.postsPerPage < this.featuredPosts.length) {
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
