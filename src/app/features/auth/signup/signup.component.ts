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
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  // For Password field
  passwordType: string = 'password';
  isPasswordText: boolean = false;
  passwordIcon: string = 'fa fa-eye-slash';

  // For Repeat Password field
  repeatPasswordType: string = 'password';
  isRepeatPasswordText: boolean = false;
  repeatPasswordIcon: string = 'fa fa-eye-slash';

  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      Name: ['', [Validators.required, this.validateName]],
      Username: ['', [Validators.required, this.validateUsername]],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required, this.validatePhoneNumber.bind(this)]],
      PasswordHash: ['', [Validators.required, this.passwordValidator.bind(this)]],
      RepeatPassword: ['', Validators.required],
      Birthday: ['', [Validators.required, this.validateBirthday]],
    }, { validators: this.passwordMatchValidator });
  }

  validateName(control: AbstractControl): ValidationErrors | null {
    const namePattern = /^[a-zA-Z\s]+$/;
    return namePattern.test(control.value) ? null : { invalidName: true };
  }
  
  validateUsername(control: AbstractControl): ValidationErrors | null {
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    return usernamePattern.test(control.value) ? null : { invalidUsername: true };
  }
  
  validateBirthday(control: AbstractControl): ValidationErrors | null {
    const birthday = control.value;
    // Regular expression for dd/mm/yyyy format
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  
    if (birthday && !datePattern.test(birthday)) {
      return { invalidDate: true };
    }
    return null;
  }


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
      return { invalidPhone: true }; // Return error if no pattern matches
    }
    return null; // Return null if valid
  }

  onSignUp() {
    // Check if form is valid
    if (this.signUpForm.valid) {
      const formValue = {
        ...this.signUpForm.value,
        Birthday: new Date(this.signUpForm.value.Birthday).toISOString() // Ensure correct ISO format
      };

      console.log(formValue); // Log to ensure data looks correct

      this.auth.signUp(formValue).subscribe({
        next: (res) => {
          console.log('User registered successfully');
          // Attempt to log in immediately after signup
          const loginData = {
            email: formValue.Email,
            password: formValue.PasswordHash,
          };

          this.auth.login(loginData).subscribe({
            next: (loginRes) => {
              this.auth.storeToken(loginRes); // Store token if received
              this.signUpForm.reset();
              this.router.navigate(['']); // Redirect to homepage
            },
            error: (err) => {
              console.error('Login failed:', err);
              this.openSnackBar('Failed to log in after registration', 'Close');
            }
          });
        },
        error: (err) => {
          if (err.error?.Message === "User already exists.") {
            this.openSnackBar('This email is already in use', 'Close');
          } else {
            console.error('Something went wrong. Please try again', err);
          }
        }
      });
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Toggle visibility of password field
  togglePasswordVisibility() {
    this.isPasswordText = !this.isPasswordText;
    this.passwordIcon = this.isPasswordText ? 'fa fa-eye' : 'fa fa-eye-slash';
    this.passwordType = this.isPasswordText ? 'text' : 'password';
  }

  // Toggle visibility of repeat password field
  toggleRepeatPasswordVisibility() {
    this.isRepeatPasswordText = !this.isRepeatPasswordText;
    this.repeatPasswordIcon = this.isRepeatPasswordText ? 'fa fa-eye' : 'fa fa-eye-slash';
    this.repeatPasswordType = this.isRepeatPasswordText ? 'text' : 'password';
  }
}
