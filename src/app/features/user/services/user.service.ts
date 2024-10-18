import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment.development';
import { UpdateUser } from '../models/update-user.model';
import { DeleteResponse } from '../models/delete-response.model';

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

  
  addUser(formValue: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formValue).pipe(
        map((response: any) => response.userId) // Assuming your API returns the created user's ID
    );
}

  
  
 // Method to get users by page for pagination
 getUsersByPage(page: number, pageSize: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.baseUrl}/users?page=${page}&pageSize=${pageSize}`);
}

//  deleteUser(id: string): Observable<DeleteResponse> {
 //   return this.http.delete<DeleteResponse>(`${this.baseUrl}/${id}`);
  //}

  deleteUser(userId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${userId}`, { responseType: 'text' as 'json' });
  }
  
  
}
