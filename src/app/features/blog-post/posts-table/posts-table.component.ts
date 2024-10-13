import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-posts-table',
  templateUrl: './posts-table.component.html',
  styleUrls: ['./posts-table.component.css'],
  providers: [DatePipe]
})
export class PostsTableComponent implements OnInit {
  unapprovedPosts: any[] = [];
  approvedPosts: any[] = [];
  displayedUnapprovedPosts: any[] = [];
  displayedApprovedPosts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPagesApproved: number = 1;

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadUnapprovedPosts();
    this.loadApprovedPosts();
  }

  loadUnapprovedPosts() {
    this.postService.getUnapprovedPosts().subscribe((data) => {
      this.unapprovedPosts = data.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
      this.displayedUnapprovedPosts = this.unapprovedPosts; // Initially, display all unapproved posts
      this.updateDisplayedPosts();
    });
  }

  loadApprovedPosts() {
    this.postService.getAllPosts().subscribe((data) => {
      this.approvedPosts = data; // No need to filter since getAllPosts returns only approved posts
      this.updateDisplayedPosts();
    });
  }

  updateDisplayedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedApprovedPosts = this.approvedPosts.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalPagesApproved = Math.ceil(this.approvedPosts.length / this.itemsPerPage);
  }

  approvePost(postId: string) {
    this.postService.approvePost(postId).subscribe(
      () => {
        this.snackBar.open('Post approved successfully!', 'Close', { duration: 3000 });
        this.unapprovedPosts = this.unapprovedPosts.filter(post => post.PostId !== postId);
        this.loadApprovedPosts(); // Refresh the approved posts list
      },
      (error) => {
        console.error('Error approving post:', error);
        this.snackBar.open('Error approving post.', 'Close', { duration: 3000 });
      }
    );
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.snackBar.open('Post deleted successfully!', 'Close', { duration: 3000 });
        this.approvedPosts = this.approvedPosts.filter(post => post.PostId !== postId);
        this.updateDisplayedPosts(); // Update the displayed posts after deletion
      },
      (error) => {
        console.error('Error deleting post:', error);
        this.snackBar.open('Error deleting post.', 'Close', { duration: 3000 });
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedPosts(); // Refresh displayed posts on page change
  }

  formatDate(dateString: string) {
    return this.datePipe.transform(dateString, 'short');
  }
}
