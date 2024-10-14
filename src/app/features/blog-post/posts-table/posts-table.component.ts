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

  // Pagination states for unapproved posts
  currentPageUnapproved: number = 1;
  itemsPerPageUnapproved: number = 5;
  totalPagesUnapproved: number = 1;

  // Pagination states for approved posts
  currentPageApproved: number = 1;
  itemsPerPageApproved: number = 5;
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
      this.totalPagesUnapproved = Math.ceil(this.unapprovedPosts.length / this.itemsPerPageUnapproved);
      this.updateDisplayedUnapprovedPosts();
    });
  }

  loadApprovedPosts() {
    this.postService.getAllPosts().subscribe((data) => {
      this.approvedPosts = data; // No need to filter since getAllPosts returns only approved posts
      this.totalPagesApproved = Math.ceil(this.approvedPosts.length / this.itemsPerPageApproved);
      this.updateDisplayedApprovedPosts();
    });
  }

  updateDisplayedUnapprovedPosts() {
    const startIndex = (this.currentPageUnapproved - 1) * this.itemsPerPageUnapproved;
    this.displayedUnapprovedPosts = this.unapprovedPosts.slice(startIndex, startIndex + this.itemsPerPageUnapproved);
  }

  updateDisplayedApprovedPosts() {
    const startIndex = (this.currentPageApproved - 1) * this.itemsPerPageApproved;
    this.displayedApprovedPosts = this.approvedPosts.slice(startIndex, startIndex + this.itemsPerPageApproved);
  }

  approvePost(postId: string) {
    this.postService.approvePost(postId).subscribe(
      () => {
        this.snackBar.open('Post approved successfully!', 'Close', { duration: 3000 });
        this.unapprovedPosts = this.unapprovedPosts.filter(post => post.PostId !== postId);
        this.loadApprovedPosts(); // Refresh the approved posts list
        this.updateDisplayedUnapprovedPosts();
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
        this.updateDisplayedApprovedPosts();
      },
      (error) => {
        console.error('Error deleting post:', error);
        this.snackBar.open('Error deleting post.', 'Close', { duration: 3000 });
      }
    );
  }

  onUnapprovedPageChange(page: number) {
    this.currentPageUnapproved = page;
    this.updateDisplayedUnapprovedPosts();
  }

  onApprovedPageChange(page: number) {
    this.currentPageApproved = page;
    this.updateDisplayedApprovedPosts();
  }

  formatDate(dateString: string) {
    return this.datePipe.transform(dateString, 'short');
  }
}
