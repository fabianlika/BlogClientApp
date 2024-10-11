import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { UpdateUser } from '../models/update-user.model';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcryptjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  userForm!: FormGroup;
  userData!: User;
  isEditingPassword: boolean = false;
  passwordMismatch: boolean = false;
  confirmPasswordTouched: boolean = false;
  validationErrors: { email?: string; tel?: string } = {};
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    
  ) {}

  ngOnInit(): void {
    this.initUserForm();
    this.loadUserData();
  }

  private initUserForm() {
    this.userForm = this.fb.group({
      Name: ['', Validators.required],
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', Validators.required],
      Birthday: ['', Validators.required],
      PasswordHash: [''],  // Password is optional until edited
      ConfirmPassword: ['']
    });

    // Reactively check password matching
    this.userForm.get('PasswordHash')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    this.userForm.get('ConfirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    // Listen for email and phone number input changes
    this.userForm.get('Email')?.valueChanges.subscribe(() => {
      this.onInputEmail();
    });

    this.userForm.get('PhoneNumber')?.valueChanges.subscribe(() => {
      this.checkTel();
    });
  }

  private loadUserData() {
    const userId = this.authService.getUserIdFromToken();
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.userData = user;
        this.userForm.patchValue(user);
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  toggleEditPassword() {
    this.isEditingPassword = !this.isEditingPassword;
    if (!this.isEditingPassword) {
      this.userForm.patchValue({ PasswordHash: '', ConfirmPassword: '' });
    }
  }

  togglePasswordVisibility(type: string) {
    if (type === 'new') {
      this.showPassword = !this.showPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  public checkPasswords() {
    const password = this.userForm.get('PasswordHash')?.value;
    const confirmPassword = this.userForm.get('ConfirmPassword')?.value;
    this.passwordMismatch = password !== confirmPassword;
    this.confirmPasswordTouched = !!confirmPassword; // Set to true if ConfirmPassword has been touched
  }

  onInputEmail(): void {
    if (this.userForm.get('Email')?.value && !/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(this.userForm.get('Email')?.value)) {
      this.validationErrors.email = "The allowed email format is: email@domain.com!";
    } else {
      this.validationErrors.email = '';
    }
  }

  checkTel(): boolean {
    const val = this.userForm.get('PhoneNumber')?.value?.toString();
    const pattern1: RegExp = /^(\+[3][5][5][6][7-9][0-9]{7}){1}$/i;
    const pattern2: RegExp = /^([0][6][7-9][0-9]{7}){1}$/i;
    const pattern3: RegExp = /^(\+[3][5][5][4-5][0-9]{7}){1}$/i;
    const pattern4: RegExp = /^([0][4-5][0-9]{7}){1}$/i;
    const pattern5: RegExp = /^([6][7-9][0-9]{7}){1}$/i;;

    if (val) {
      const isMatch = pattern1.test(val) || pattern2.test(val) || pattern3.test(val) || pattern4.test(val) || pattern5.test(val);
      if (isMatch) {
        this.validationErrors.tel = '';
        return true;
      }
    }

    this.validationErrors.tel = 'Please enter a valid number in the format: "+3556xxxxxxxx/06xxxxxxxx/+355xxxxxxxx/0xxxxxxxx"!';
    return false;
  }

  updateUser() {
    const userId = this.authService.getUserIdFromToken();
    const updatedUserData: UpdateUser = { ...this.userForm.value };

    // Destructure PasswordHash and ConfirmPassword
    const { PasswordHash, ConfirmPassword, ...rest } = updatedUserData;

    // If editing password
    if (this.isEditingPassword) {
      if (this.passwordMismatch) {
        this.openSnackBar('Passwords do not match. Please correct.', 'Close');
        return;
      }

      // Only hash the password if it is filled
      if (PasswordHash) {
        updatedUserData.PasswordHash = bcrypt.hashSync(PasswordHash, 10);
      } else {
        // If not filling password, don't include it in the update
        delete updatedUserData.PasswordHash; // Ensure it's removed
      }
    } else {
      // If not editing password, ensure PasswordHash is removed
      delete updatedUserData.PasswordHash;
    }

    // Prepare final data for the update
    const finalUpdateData = { ...rest };

    // Check if there are validation errors
    if (this.validationErrors.email || this.validationErrors.tel) {
      this.openSnackBar('Please fix the validation errors.', 'Close');
      return;
    }

    this.userService.updateUser(userId, finalUpdateData).subscribe({
      next: (response) => {
        console.log('User updated successfully', response);
        this.openSnackBar('User data updated successfully', 'Close');
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.openSnackBar('Failed to update user data', 'Close');
      }
    });
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
