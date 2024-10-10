import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { ConfirmDialogService } from 'src/app/features/user/services/confirm-dialog.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];  // Store all users
  paginatedUsers: User[] = [];  // Users for the current page
  currentPage: number = 1;  // Track the current page
  pageSize: number = 10;    // Number of users per page
  totalPages: number = 1;   // Total number of pages

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadUsers();  // Load all users when the component initializes
  }

  // Fetch all users from the service
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);  // Calculate total pages
        this.paginateUsers(this.currentPage);  // Set initial paginated users
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  // Paginate users for the current page
  paginateUsers(page: number): void {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  // Method to handle pagination change
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.paginateUsers(this.currentPage);  // Update the displayed users based on the new page
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: { user } // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh the list after editing
      }
    });
  }

  deleteUser(userId: string): void {
    this.confirmDialogService.confirm('Are you sure you want to delete this user?')
      .then((confirmed) => {
        if (confirmed) {
          this.userService.deleteUser(userId).subscribe({
            next: () => {
              this.loadUsers(); // Refresh users after deletion
            },
            error: (err) => {
              console.error('Error deleting user', err);
            }
          });
        }
      });
  }
}
