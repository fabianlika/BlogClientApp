import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // For snack bar notifications

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Adjust to your CSS file
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash'; // Default to eye-slash icon
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
    });
  }

  showPassword() {
    this.isText = !this.isText; // Toggle the state
    this.eyeIcon = this.isText ? 'fa fa-eye' : 'fa fa-eye-slash'; // Change icon based on state
    this.type = this.isText ? 'text' : 'password'; // Change input type
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.Email.trim(), // Ensure correct casing and trim whitespace
        password: this.loginForm.value.Password,
      };

      this.auth.login(loginData).subscribe({
        next: (res) => {
          console.log('Login successful:', res);
          this.auth.storeToken(res); // Store the token received from the API
          this.loginForm.reset(); // Reset the form
          this.router.navigate(['']); // Redirect to dashboard after login
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.openSnackBar('Invalid credentials', 'Close'); // Show error message
        },
      });
    } else {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
