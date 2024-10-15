import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRoleDetail } from '../models/user-role-details.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private apiUrl = `${environment.apiBaseUrl}/api/UserRole/UserRoleDetails`;
  private apiUrl2 = `${environment.apiBaseUrl}/api/UserRole`;

  constructor(private http: HttpClient) {}

  getAllUserRoles(): Observable<UserRoleDetail[]> {
    return this.http.get<UserRoleDetail[]>(this.apiUrl);
  }


  updateUserRole(userId: string, role: string): Observable<any> {

    return this.http.put(`${this.apiUrl2}/${userId}`, { userId, roles: role });
  }

  deleteUserRole(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl2}/${userId}`);
  }

  addUserRole(userId: string, role: string): Observable<any> {
    const addPayload = { UserId: userId, Roles: role }; // Use uppercase keys
    return this.http.post(`${this.apiUrl2}`, addPayload);
}


  updateUserRoles(userId: string, roles: string[]): Observable<any> {
    const updatePayload = { roles };
    return this.http.put(`${this.apiUrl2}/${userId}`, updatePayload);
  }

  getUserRolebyUserId(userId: string): Observable<UserRoleDetail> {
    return this.http.get<UserRoleDetail>(`${this.apiUrl2}/${userId}`);
  }

}
