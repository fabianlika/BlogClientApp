import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { PostPhotoService } from '../services/post-photo.service';
import { AuthService } from '../../auth/services/auth.service';
import { ConfirmDialogService } from '../../user/services/confirm-dialog.service';
import { PostPhotoDto } from '../models/add-post-photo.model';
import { Post } from '../models/post.model';
import { BlogComment } from '../models/comment.model';
import { CreateComment } from '../models/create-comment.model';
import { UserService } from '../../user/services/user.service'; 

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  post: Post | null = null;
  postImages: string[] = [];
  postFiles: { name: string; content: string; type: string }[] = [];
  isModalOpen: boolean = false;
  selectedImage: string = '';
  currentImageIndex: number = 0;
  canEditPost: boolean = false; 
  isEditModalOpen: boolean = false;
  selectedPost: Post | null = null;
  comments: BlogComment[] = []; // Store comments
  newComment: CreateComment = { Content: '', UserId: '', PostId: '' };
  editingCommentIndex: number | null = null; // Track which comment is being edited
  editCommentContent: string = '';

  isCommentModalOpen: boolean = false;
  newCommentContent: string = ''; // Store new comment content

  users: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private postPhotoService: PostPhotoService,
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(postId).subscribe((data: Post) => {
        this.post = data;
        this.loadFilesForPost(postId);
        this.loadComments(postId);
        this.checkEditPermission();
      });
    }
  }

  loadFilesForPost(postId: string): void {
    this.postPhotoService.getPhotosByPostId(postId).subscribe((files: PostPhotoDto[]) => {
      this.postImages = [];
      this.postFiles = [];

      files.forEach((file: PostPhotoDto) => {
        const byteCharacters = atob(file.PhotoContent);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: file.FileType });
        const url = URL.createObjectURL(blob);

        if (file.IsImage === 1) {
          this.postImages.push(url);
        } else {
          this.postFiles.push({ name: file.FileName, content: url, type: file.FileType });
        }
      });
    }, (error) => {
      console.error('Error fetching images:', error);
    });
  }

  loadComments(postId: string): void {
    this.postService.getCommentsByPostId(postId).subscribe((data: any[]) => {
      this.comments = data.map(item => ({
        CommentId: item.CommentId,
        Content: item.Content,
        CreatedAt: new Date(item.CreatedAt),
        UserId: item.UserId,
        PostId: item.PostId,
        UserName: ''
        
      }));
      

      this.comments.forEach(comment => {
        this.userService.getUserById(comment.UserId).subscribe(user => {
          this.users[comment.UserId] = user.Name; // Assuming user has a 'name' field
          comment.UserName = user.Name; // Set the UserName in the comment
        });
      });

    }, (error) => {
      console.error('Error fetching comments:', error);
    });
  }
  
  // Method to check if the user can edit or delete the comment
  canEditComment(comment: BlogComment): boolean {
    const currentUserId = this.authService.getUserIdFromToken();
    const currentUserRole = this.authService.getRoleFromToken();
    return comment.UserId === currentUserId || currentUserRole === 'admin';
  }

  startEditingComment(index: number): void {
    this.editingCommentIndex = index;
    this.editCommentContent = this.comments[index].Content;
  }

  cancelEdit(): void {
    this.editingCommentIndex = null;
    this.editCommentContent = '';
  }

  openEditCommentModal(comment: BlogComment): void {
    // Open the modal for editing the comment (similar to the post editing logic)
    // Set up logic for editing the comment
    console.log('Editing comment:', comment);
    // Logic for opening the modal goes here
  }

  updateComment(index: number): void {
    if (this.editCommentContent.trim()) {
      const updatedComment = { 
        ...this.comments[index], 
        Content: this.editCommentContent 
      };
  
      this.postService.updateComment(updatedComment).subscribe(
        (updatedComment) => {
          this.comments[index] = updatedComment;
          this.cancelEdit();
        },
        (error) => {
          console.error('Error updating comment:', error);
        }
      );
    }
  }
  

  deleteComment(commentId: string): void {
    this.confirmDialogService.confirm('Are you sure you want to delete this comment?').then((confirmed) => {
      if (confirmed) {
        this.postService.deleteComment(commentId).subscribe(() => {
          this.comments = this.comments.filter(comment => comment.CommentId !== commentId);
        }, (error) => {
          console.error('Error deleting comment:', error);
        });
      }
    });
  }
  
  

  checkEditPermission(): void {
    const currentUserId = this.authService.getUserIdFromToken();
    const currentUserRole = this.authService.getRoleFromToken();

    if (this.post && currentUserId) {
      this.canEditPost = (currentUserId === this.post.UserId || currentUserRole === 'admin');
    } else {
      this.canEditPost = false;
    }
  }

  openImage(image: string) {
    this.selectedImage = image;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.postImages.length;
  }

  previousImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.postImages.length) % this.postImages.length;
  }

  openEditPostModal(post: Post) {
    this.selectedPost = post;
    this.isEditModalOpen = true;
  }

  closeEditPostModal() {
    this.isEditModalOpen = false;
    this.selectedPost = null;
  }

  handlePostUpdated(event: any): void {
    const updatedPost = event as Post;
    if (updatedPost) {
      this.post = updatedPost;
      this.closeEditPostModal();
    } else {
      console.error('Updated post is null or invalid');
    }
    this.closeEditPostModal();
  }

  async deletePost(): Promise<void> {
    const confirmed = await this.confirmDialogService.confirm('Are you sure you want to delete this post?');
    if (confirmed && this.post) {
      this.postService.deletePost(this.post.PostId).subscribe(() => {
        this.router.navigate(['/posts']);
      }, (error) => {
        console.error('Error deleting post:', error);
      });
    }
  }

 

  addComment(): void {
    if (this.post) {
        this.newComment = {
            Content: this.newCommentContent, 
            UserId: this.authService.getUserIdFromToken(),
            PostId: this.post.PostId
        };
        
        this.postService.addComment(this.newComment).subscribe((addedComment: BlogComment) => {
            this.comments.push(addedComment);
            this.newCommentContent = ''; // Reset the comment input field
        }, (error) => {
            console.error('Error adding comment:', error);
        });
    }


}
}