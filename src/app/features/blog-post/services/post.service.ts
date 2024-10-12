import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostDto } from 'src/app/features/blog-post/models/create-post.dto.model';
import { environment } from 'src/environments/environment.development';
import { Post } from '../models/post.model';
import { CreateComment } from '../models/create-comment.model';
import { BlogComment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiBaseUrl}/api/Post`;
  private apiUrl2 = `${environment.apiBaseUrl}/api/Comment`;

  constructor(private http: HttpClient) {}

  addPost(post: FormData): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }
  

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${postId}`);
  }
  
  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.PostId}`, post);
  }

  updateComment(comment: BlogComment): Observable<BlogComment> {
    return this.http.put<BlogComment>(`${this.apiUrl2}/${comment.CommentId}`, comment);
  }
  

  deletePost(id: string): Observable<Post> {
    return this.http.delete<Post>(`${this.apiUrl}/${id}`);
  }

  deleteComment(id: string): Observable<Comment> {
    return this.http.delete<Comment>(`${this.apiUrl2}/${id}`);
  }

  
  getCommentsByPostId(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl2}/post/${postId}`);
  }

  addComment(comment: CreateComment): Observable<BlogComment> {
    return this.http.post<BlogComment>(`${this.apiUrl2}`, comment);
  }


  
  
  

  getCategories(): Observable<{ CategoryId: string; Name: string; Url: string }[]> {
    return this.http.get<{ CategoryId: string; Name: string; Url: string }[]>(`${environment.apiBaseUrl}/api/Category`);
  }
  
  createPostWithFiles(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}`, postData);
  }

  uploadImages(postId: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/upload-images`, formData);
  }



  approvePost(postId: string) {

    return this.http.put<any>(`${this.apiUrl}/approve/${postId}`, FormData);
    
  }
  
  disapprovePost(postId: string) {
    return this.http.put<any>(`${this.apiUrl}/disapprove/${postId}`, FormData);
  }

  getUnapprovedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/unapproved`);
  }
  
  

}
