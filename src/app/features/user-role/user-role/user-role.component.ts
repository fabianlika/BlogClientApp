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
  errorMessage: string = '';
  dropdownStates: { [userId: string]: boolean } = {};

  constructor(private userRoleService: UserRoleService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUserRoles();
  }

  loadUserRoles(): void {
    this.userRoleService.getAllUserRoles().subscribe({
      next: (data) => {
        this.userRoles = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user roles';
      }
    });
  }

  toggleRoleDropdown(userId: string): void {
    this.dropdownStates[userId] = !this.dropdownStates[userId];
  }


  isDropdownVisible(userId: string): boolean {
    return this.dropdownStates[userId] || false;
  }

  updateRole(userRole: UserRoleDetail): void {
    this.userRoleService.updateUserRole(userRole.UserId, userRole.selectedRole).subscribe({
      next: (response) => {
        // Show success message in a snackbar
        this.snackBar.open('Role updated successfully', 'Close', {
          duration: 3000,  // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'  // Adjust as per your design
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to update role.';
      }
    });
  }

}
