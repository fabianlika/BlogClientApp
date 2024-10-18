import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserRoleService } from '../../user-role/services/user-role.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { ConfirmDialogService } from 'src/app/features/user/services/confirm-dialog.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserRoleDetail } from 'src/app/features/user-role/models/user-role-details.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];          
  paginatedUsers: User[] = []; 
  currentPage: number = 1;     
  pageSize: number = 10;       
  totalPages: number = 1;      
  searchTerm: string = '';  
  userRoles: { [key: string]: string } = {};     

  constructor(
    private userService: UserService,
    private userRoleService: UserRoleService,
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.loadUserRoles();
        this.filterAndPaginateUsers(); 
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
    console.log('Users after deletion:', this.users);
  }

  loadUserRoles(): void {
    this.userRoleService.getAllUserRoles().subscribe({
      next: (roles: UserRoleDetail[]) => {
        roles.forEach(role => {
          this.userRoles[role.UserId] = role.Roles; 
        });
        this.mapRolesToUsers(); 
      },
      error: (err) => {
        console.error('Error fetching user roles:', err);
      },
    });
  }

  mapRolesToUsers(): void {
    this.users.forEach(user => {
      user.Role = this.userRoles[user.UserId] || 'No Role Assigned'; 
    });
    this.filterAndPaginateUsers();
  }
  
  filterAndPaginateUsers(): void {
    // Filter users based on the search term
    const filteredUsers = this.users.filter(user => 
      user.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    // Update the total number of pages after filtering
    this.totalPages = Math.ceil(filteredUsers.length / this.pageSize); 
  
    // Paginate users for the current page
    this.paginateUsers(this.currentPage, filteredUsers); 
  }
  
  // Paginate users for the current page
  paginateUsers(page: number, userList: User[] = this.users): void {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = userList.slice(startIndex, endIndex);
  }
  
  
  
  // Method to handle pagination change
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.filterAndPaginateUsers(); 
  }

  // Filter users based on the search term when user types in the search input
  onSearch(): void {
    this.currentPage = 1; 
    this.filterAndPaginateUsers(); 
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: { user } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); 
      }
    });
  }
  deleteUser(userId: string): void {
    this.confirmDialogService.confirm('Are you sure you want to delete this user?')
      .then((confirmed) => {
        if (confirmed) {
          this.userService.deleteUser(userId).subscribe({
            next: (response) => {
              console.log('Delete response:', response); // Log the response
              if (response === "User deleted successfully.") {
                // If the deletion is successful, navigate to the user list page
                this.router.navigate(['/user-list']);
                this.loadUsers();
                window.location.reload();
              } else {
                console.error('Unexpected response:', response);
              }
            },
            error: (err) => {
              console.error('Error deleting user:', err);
            }
          });
        }
      });
  }
  
  
  
  
  
  

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); 
      }
    });
  }
}
