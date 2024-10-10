import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CreatePostPhotoDto } from '../models/create-post-photo.dto.model';
import { PostPhotoDto } from '../models/add-post-photo.model';

@Injectable({
  providedIn: 'root'
})
export class PostPhotoService {
  private apiUrl = `${environment.apiBaseUrl}/api/PostPhoto`;

  constructor(private http: HttpClient) {}

  uploadPostPhoto(photoDto: FormData): Observable<any> {
    return this.http.post(this.apiUrl, photoDto);
  }

  getPhotosByPostId(postId: string) : Observable<PostPhotoDto[]> {
    return this.http.get<PostPhotoDto[]>(`${this.apiUrl}/post/${postId}`);
  }



    

}
