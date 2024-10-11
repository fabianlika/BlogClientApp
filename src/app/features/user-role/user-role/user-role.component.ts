import { Component, OnInit } from '@angular/core';
import { UserRoleService } from '../services/user-role.service';
import { UserRoleDetail } from '../models/user-role-details.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {

  userRoles: UserRoleDetail[] = [];
  pagedUserRoles: UserRoleDetail[] = [];
  errorMessage: string = '';
  dropdownStates: { [userId: string]: boolean } = {};
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private userRoleService: UserRoleService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUserRoles();
  }

  loadUserRoles(): void {
    this.userRoleService.getAllUserRoles().subscribe({
      next: (data) => {
        this.userRoles = data;
        this.totalPages = Math.ceil(this.userRoles.length / this.itemsPerPage);
        this.updatePagedUserRoles();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user roles';
      }
    });
  }

  updatePagedUserRoles(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedUserRoles = this.userRoles.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagedUserRoles();
  }

  toggleRoleDropdown(userId: string): void {
    this.dropdownStates[userId] = !this.dropdownStates[userId];
  }

  isDropdownVisible(userId: string): boolean {
    return this.dropdownStates[userId] || false;
  }

  updateRole(userRole: UserRoleDetail): void {
    this.userRoleService.updateUserRole(userRole.UserId, userRole.selectedRole).subscribe({
      next: () => {
        this.snackBar.open('Role updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.errorMessage = 'Failed to update role.';
      }
    });
  }
}
