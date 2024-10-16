import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment.development';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://192.168.15.40:2398/api/Category';

  constructor(private http: HttpClient) { }

 addCategory(model: AddCategoryRequest): Observable<void> {

  return this.http.post<void>(`${environment.apiBaseUrl}/api/Category`, model);
 }


 getAllCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(this.baseUrl);
}


getCategoryById(id: string): Observable<Category>{

 return  this.http.get<Category>(`${environment.apiBaseUrl}/api/Category/${id}`);
}

updateCategory(id: string, updateCategoryRequest: UpdateCategoryRequest): Observable<Category> {

 return this.http.put<Category>(`${environment.apiBaseUrl}/api/Category/${id}`,updateCategoryRequest );

}

deleteCategory(id: string) : Observable<Category> {

  return this.http.delete<Category>(`${environment.apiBaseUrl}/api/Category/${id}`)
}



 }



