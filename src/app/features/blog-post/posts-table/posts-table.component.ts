import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';  // Import DatePipe

@Component({
  selector: 'app-posts-table',
  templateUrl: './posts-table.component.html',
  styleUrls: ['./posts-table.component.css'],
  providers: [DatePipe]  // Add DatePipe as a provider
})
export class PostsTableComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private postService: PostService, 
    private snackBar: MatSnackBar, 
    private datePipe: DatePipe  // Inject DatePipe
  ) {}

  ngOnInit(): void {
    this.loadUnapprovedPosts();
  }

  loadUnapprovedPosts() {
    this.postService.getUnapprovedPosts().subscribe((data) => {
      // Sort posts by CreatedAt date in descending order
      this.posts = data.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
      this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
    });
  }

  approvePost(postId: string) {
    this.postService.approvePost(postId).subscribe(
      (response) => {
        this.snackBar.open('Post approved successfully!', 'Close', { duration: 3000 });
        this.posts = this.posts.filter(post => post.PostId !== postId);
        this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Error approving post:', error);
        this.snackBar.open('Error approving post.', 'Close', { duration: 3000 });
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  get displayedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.posts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Method to format the date using DatePipe
  formatDate(dateString: string) {
    return this.datePipe.transform(dateString, 'short');
  }
}
