import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment.development';
import { UpdateUser } from '../models/update-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiBaseUrl}/api/User`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: string, updateUser: UpdateUser): Observable<User> {
    return this.http.put<User>(`${environment.apiBaseUrl}/api/User/${id}`, updateUser);
  }
  
 // Method to get users by page for pagination
 getUsersByPage(page: number, pageSize: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.baseUrl}/users?page=${page}&pageSize=${pageSize}`);
}

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }

  
}
