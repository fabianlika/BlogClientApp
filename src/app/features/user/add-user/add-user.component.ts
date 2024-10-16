import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import ValidateForm from 'src/app/core/helpers/validateForm';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs'; 
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  // For Password field
  passwordType: string = 'password';
  isPasswordText: boolean = false;
  passwordIcon: string = 'fa fa-eye-slash';

  // For Repeat Password field
  repeatPasswordType: string = 'password';
  isRepeatPasswordText: boolean = false;
  repeatPasswordIcon: string = 'fa fa-eye-slash';

  addUserForm!: FormGroup;
  emailErrorMessage: string = ''; // Error message property for email

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<AddUserComponent> 
  ) {}

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      Name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      Username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],

      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required, this.validatePhoneNumber.bind(this)]],
      PasswordHash: ['', [Validators.required, this.passwordValidator]], // Apply password validator here
      RepeatPassword: ['', Validators.required],
      Birthday: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],

    }, { validators: this.passwordMatchValidator });
  }

  // Password Validator Function
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/; // At least 8 characters, one number, one special character, and one capitalized letter

    return password && !passwordPattern.test(password) ? { invalidPassword: true } : null;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('PasswordHash')?.value === form.get('RepeatPassword')?.value
      ? null : { mismatch: true };
  }

  validatePhoneNumber(control: any): { [key: string]: boolean } | null {
    const val = control.value?.toString();
    const pattern1: RegExp = /^(\+[3][5][5][6][7-9][0-9]{7}){1}$/i;
    const pattern2: RegExp = /^([0][6][7-9][0-9]{7}){1}$/i;
    const pattern3: RegExp = /^(\+[3][5][5][4-5][0-9]{7}){1}$/i;
    const pattern4: RegExp = /^([0][4-5][0-9]{7}){1}$/i;

    if (val && !pattern1.test(val) && !pattern2.test(val) && !pattern3.test(val) && !pattern4.test(val)) {
      return { invalidPhone: true };
    }
    return null;
  }

  onAddUser() {
    if (this.addUserForm.valid) {
      const email = this.addUserForm.value.Email;

      // Check if the email is already in use
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          const emailExists = users.some(user => user.Email === email);
          if (emailExists) {
            // Set the error message if the email is already in use
            this.emailErrorMessage = 'Email is already in use!';
            return; // Stop further processing
          } else {
            // Clear the error message if the email is valid
            this.emailErrorMessage = '';
          }

          // Proceed with user addition
          const password = this.addUserForm.value.PasswordHash;
          const hashedPassword = this.hashPassword(password);

          const formValue = {
            ...this.addUserForm.value,
            PasswordHash: hashedPassword,
            Birthday: new Date(this.addUserForm.value.Birthday).toISOString()
          };

          this.userService.addUser(formValue).subscribe({
            next: () => {
              // Close the modal after successful addition
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.error('Error adding user:', err);
              // Handle error for adding user
            },
          });
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          // Handle error for fetching users
        }
      });
    } else {
      ValidateForm.validateAllFormFields(this.addUserForm);
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10); // Generate a salt
    return bcrypt.hashSync(password, salt); // Hash the password with the salt
  }

  togglePasswordVisibility() {
    this.isPasswordText = !this.isPasswordText;
    this.passwordIcon = this.isPasswordText ? 'fa fa-eye' : 'fa fa-eye-slash';
    this.passwordType = this.isPasswordText ? 'text' : 'password';
  }

  toggleRepeatPasswordVisibility() {
    this.isRepeatPasswordText = !this.isRepeatPasswordText;
    this.repeatPasswordIcon = this.isRepeatPasswordText ? 'fa fa-eye' : 'fa fa-eye-slash';
    this.repeatPasswordType = this.isRepeatPasswordText ? 'text' : 'password';
  }
}
