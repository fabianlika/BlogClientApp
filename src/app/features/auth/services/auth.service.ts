import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { User } from '../../user/models/user.model';
import { UpdateUser } from '../../user/models/update-user.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7256/api/Auth/';
  private baseUrl1: string = 'https://localhost:7256/api/User/';
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodeToken();
  }

  // Signup method
  signUp(request: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register`, request);
  }

  // Logout method
  signOut() {
    localStorage.clear();
    this.router.navigate(['login']); // Redirect to login page
  }

  // Login method
  login(request: { email: string; password: string }): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}login`, request, {
      responseType: 'text' as 'json',
    });
  }

  // Store token in local storage
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  // Get token from local storage
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Decode the token to get payload
  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    return token ? jwtHelper.decodeToken(token) : null;
  }

  // Get UserId from token
  getUserIdFromToken() {
    this.userPayload = this.decodeToken();
    return this.userPayload?.nameid; // Adjust based on your JWT payload structure
  }

  // Get role from token
  getRoleFromToken() {
    this.userPayload = this.decodeToken();
    return this.userPayload?.role; // Adjust based on your JWT payload structure
  }

  // Check if user is an Admin
  isAdmin(): boolean {
    return this.getRoleFromToken() === 'admin';
  }

  // Check if user is a regular User
  isUser(): boolean {
    return this.getRoleFromToken() === 'user';
  }


  updateUser(id: string, updateUser: UpdateUser): Observable<User> {
    return this.http.put<User>(`${environment.apiBaseUrl}/api/User/${id}`, updateUser);
  }
  


}
