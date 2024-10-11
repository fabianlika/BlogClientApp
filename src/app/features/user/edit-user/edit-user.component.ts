import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { UpdateUser } from '../models/update-user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as bcrypt from 'bcryptjs'; 
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {

  private editUserSubscription?: Subscription;
  user: User;
  validationErrors: any = { email: '', tel: '' };
  editPassword: boolean = false; // Track if editing password
  confirmPassword: string = ''; // Store confirm password input
  showPassword: boolean = false; // Track new password visibility
  showConfirmPassword: boolean = false; // Track confirm password visibility

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.user = { ...data.user }; // Clone the user data for editing
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.editUserSubscription?.unsubscribe();
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

  onFormSubmit(): void {
    // Check for validation errors before proceeding
    if (this.validationErrors.email || this.validationErrors.tel) {
      this.snackBar.open('Please fix the validation errors before saving.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'custom-snackbar-error' // Add error class here
      });
      return; // Exit if there are validation errors
    }

    // Check if editing the password and that it matches the confirm password
    if (this.editPassword) {
      if (this.user.PasswordHash !== this.confirmPassword) {
        this.snackBar.open('Passwords do not match!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'custom-snackbar-error'
        });
        return; // Exit if passwords do not match
      }
      
      // Hash the new password
      this.user.PasswordHash = bcrypt.hashSync(this.confirmPassword, 10); // Hash the password
    }

    const updateUser: UpdateUser = {
      Name: this.user.Name,
      Username: this.user.Username,
      Email: this.user.Email,
      Birthday: this.user.Birthday,
      PhoneNumber: this.user.PhoneNumber,
      PasswordHash: this.user.PasswordHash // This will be the hashed password
    };

    this.editUserSubscription = this.userService.updateUser(this.user.UserId.toString(), updateUser)
      .subscribe({
        next: (response) => {
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
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
    if (this.user.Email && !/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(this.user.Email)) {
      this.validationErrors.email = "The allowed email format is: email@domain.com!";
    } else {
      this.validationErrors.email = '';
    }
  }

  checkTel(): boolean {
    const val = this.user.PhoneNumber?.toString();
    const pattern1: RegExp = /^(\+[3][5][5][6][7-9][0-9]{7}){1}$/i;
    const pattern2: RegExp = /^([0][6][7-9][0-9]{7}){1}$/i;
    const pattern3: RegExp = /^(\+[3][5][5][4-5][0-9]{7}){1}$/i;
    const pattern4: RegExp = /^([0][4-5][0-9]{7}){1}$/i;

    if (val) {
      const isMatch = pattern1.test(val) || pattern2.test(val) || pattern3.test(val) || pattern4.test(val);
      if (isMatch) {
        this.validationErrors.tel = '';
        return true;
      }
    }

    this.validationErrors.tel = 'Please enter a valid number in the format: "+3556xxxxxxxx/06xxxxxxxx/+355xxxxxxxx/0xxxxxxxx"!';
    return false;
  }

  toggleEditPassword(): void {
    this.editPassword = !this.editPassword;
    if (this.editPassword) {
      this.user.PasswordHash = ''; // Clear the current password when editing starts
      this.confirmPassword = ''; // Clear confirm password field
      this.showPassword = false; // Reset password visibility
      this.showConfirmPassword = false; // Reset confirm password visibility
    }
    this.cdRef.detectChanges();
  }
}
