import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserRoleService } from '../../user-role/services/user-role.service';
import { User } from '../models/user.model';
import { UpdateUser } from '../models/update-user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as bcrypt from 'bcryptjs'; 


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {
  private editUserSubscription?: Subscription;
  private userRoleSubscription?: Subscription;
  user: User;
  validationErrors: { email: string; tel: string; password: string; confirmPassword: string } = { email: '', tel: '', password: '', confirmPassword: '' };
  editPassword: boolean = false; // Track if editing password
  confirmPassword: string = ''; // Store confirm password input
  newPassword: string = '';
  showPassword: boolean = false; // Track new password visibility
  showConfirmPassword: boolean = false; // Track confirm password visibility

  roles: string[] = ['user', 'admin']; // Available roles
  selectedRole: string;

  constructor(
    private userService: UserService,
    private userRoleService: UserRoleService,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.user = { ...data.user }; 
    this.selectedRole = this.user.Role || 'User';
  }

  ngOnInit(): void {

    this.editPassword=false;
  }

  ngOnDestroy(): void {
    this.editUserSubscription?.unsubscribe();
    this.userRoleSubscription?.unsubscribe();
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
  onFormSubmit(): void {
    // Check for validation errors before proceeding
    if (this.validationErrors.email || this.validationErrors.tel || this.validationErrors.password || this.validationErrors.confirmPassword) {
      this.snackBar.open('Please fix the validation errors before saving.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'custom-snackbar-error'
      });
      return; // Exit if there are validation errors
    }
  
    // Check if editing the password and that it matches the confirm password
    if (this.editPassword) {
      if (this.newPassword !== this.confirmPassword) {
        this.snackBar.open('Passwords do not match!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'custom-snackbar-error'
        });
        return; // Exit if passwords do not match
      }
  
      // Hash the new password
      this.newPassword = bcrypt.hashSync(this.confirmPassword, 10); // Hash the password
    }
  
    const updateUser: UpdateUser = {
      Name: this.user.Name,
      Username: this.user.Username,
      Email: this.user.Email,
      Birthday: this.user.Birthday,
      PhoneNumber: this.user.PhoneNumber,
      PasswordHash: this.newPassword,
      Role: this.selectedRole
    };
  
    this.editUserSubscription = this.userService.updateUser(this.user.UserId.toString(), updateUser)
      .subscribe({
        next: () => {
          // After successfully updating user details, update the user role
          this.userRoleSubscription = this.userRoleService.updateUserRole(this.user.UserId.toString(), this.selectedRole)
            .subscribe({
              next: () => {
                this.snackBar.open('User details updated successfully', 'Close', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: ['custom-snackbar']
                });
                this.dialogRef.close(true);
              },
              error: () => {
                this.snackBar.open('Failed to update user role', 'Close', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'custom-snackbar-error'
                });
              }
            });
        },
        error: () => {
          this.snackBar.open('Failed to update user', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'custom-snackbar-error'
          });
        }
      });
  }
  
  onInputEmail(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex pattern
    this.validationErrors.email = this.user.Email && !emailPattern.test(this.user.Email)
      ? "The allowed email format is: email@domain.com!"
      : '';
  }

  checkTel(): boolean {
    const val = this.user.PhoneNumber?.toString();
    const patterns: RegExp[] = [
      /^\+35567[0-9]{7}$/, // Match +35567xxxxxxxx
      /^06[7-9][0-9]{7}$/, // Match 06xxxxxxxx
      /^\+355[4-5][0-9]{7}$/, // Match +3554xxxxxxxx
      /^0[4-5][0-9]{7}$/ // Match 0xxxxxxxx
    ];

    const isMatch = patterns.some(pattern => pattern.test(val!));
    this.validationErrors.tel = isMatch ? '' : 'Please enter a valid number in the format: "+3556xxxxxxxx/06xxxxxxxx/+355xxxxxxxx/0xxxxxxxx"!';

    return isMatch;
  }

  validatePassword(): void {
    // Password regex: At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.validationErrors.password = this.newPassword && !passwordPattern.test(this.newPassword)
      ? 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character!'
      : '';

    // Check if passwords match after validating the pattern
    this.checkPasswordMatch();
  }

  checkPasswordMatch(): void {
    debugger;
    if (this.editPassword && this.confirmPassword) {
      // Validate that the confirm password matches the new password
      this.validationErrors.confirmPassword = this.newPassword !== this.confirmPassword
        ? 'Passwords do not match!'
        : '';
    } else {
      this.validationErrors.confirmPassword = '';
    }
  }

  onConfirmPasswordInput(): void {
    // Call checkPasswordMatch whenever the user types in the confirm password field
    this.checkPasswordMatch();
  }

  toggleEditPassword(): void {
    // Manually set the value of editPassword instead of toggling
    this.editPassword = !this.editPassword;
  
    
    if (this.editPassword) {
      this.newPassword = ''; 
      this.confirmPassword = '';
      this.showPassword = false; 
      this.showConfirmPassword = false; 
    }
  
  
      this.cdRef.detectChanges();
    
  }
  
  
  
}
