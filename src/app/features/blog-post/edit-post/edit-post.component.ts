import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { PostPhotoService } from '../services/post-photo.service';

declare var tinymce: any;

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit, AfterViewInit {
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  @ViewChild('postForm', { static: false }) postForm!: NgForm;
  @Input() post!: Post;
  @Output() closeEditModal: EventEmitter<void> = new EventEmitter<void>();

  selectedFiles: File[] = [];
  readonly MAX_TITLE_LENGTH = 100;
  readonly MAX_CONTENT_LENGTH = 5000;
  readonly MAX_FILE_SIZE_MB = 5;

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      console.error('Post data is not available for editing.');
    }
  }

  ngAfterViewInit(): void {
    this.initializeTinyMCE();
  }

  private initializeTinyMCE(): void {
    tinymce.init({
      selector: 'textarea',
      plugins: 'link image lists',
      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | link image',
      height: 300,
      setup: (editor: any) => {
        editor.on('change', () => {
          const content = editor.getContent();
          if (content.length > this.MAX_CONTENT_LENGTH) {
            this.setMessage(`Content cannot exceed ${this.MAX_CONTENT_LENGTH} characters.`, 'error');
            editor.setContent(content.substring(0, this.MAX_CONTENT_LENGTH));
          } else {
            this.post.Content = content;
          }
        });
        editor.setContent(this.post.Content);
      }
    });
  }

  onSubmit(): void {
    if (this.post.Title.length > this.MAX_TITLE_LENGTH) {
      this.setMessage(`Title cannot exceed ${this.MAX_TITLE_LENGTH} characters.`, 'error');
      return;
    }

    this.postService.updatePost(this.post).subscribe({
      next: () => {
        this.setMessage('Post updated successfully!', 'success');
        this.uploadFiles();
      },
      error: (error) => {
        console.error('Error updating post:', error);
        this.setMessage('Failed to update post.', 'error');
      }
    });
  }

  closeModal(): void {
    this.closeEditModal.emit(); 
  }

  replaceFiles(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const validFiles = files.filter(file => {
        if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
          this.setMessage(`File ${file.name} is too large. Maximum allowed size is ${this.MAX_FILE_SIZE_MB} MB.`, 'error');
          return false;
        }
        return true;
      });
      this.selectedFiles.push(...validFiles);
    }
  }

  private uploadFiles(): void {
    const uploadRequests = this.selectedFiles.map(file => this.uploadFile(file));
    Promise.all(uploadRequests)
      .then(() => this.setMessage('Post updated successfully!', 'success'))
      .catch(error => {
        console.error('Error uploading files:', error);
        this.setMessage('Failed to upload files.', 'error');
      })
      .finally(() => this.selectedFiles = []); // Clear selected files after upload
  }

  private uploadFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('FileName', file.name);
    formData.append('FileType', file.type);
    formData.append('FileContent', file);
    formData.append('PostId', this.post.PostId);

    return new Promise((resolve, reject) => {
      this.postPhotoService.uploadPostPhoto(formData).subscribe({
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  private setMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
  }

  clearMessage(): void {
    this.message = '';
  }
}
