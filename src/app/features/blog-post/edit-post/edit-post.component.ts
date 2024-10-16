import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { PostPhotoService } from '../services/post-photo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Quill from 'quill';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit, AfterViewInit {
  @ViewChild('postForm', { static: false }) postForm!: NgForm;
  @Input() post!: Post;
  @Output() closeEditModal: EventEmitter<void> = new EventEmitter<void>();

  selectedFiles: File[] = [];
  quillEditor: any;
  readonly MAX_TITLE_LENGTH = 100;
  readonly MAX_CONTENT_LENGTH = 5000;
  readonly MAX_FILE_SIZE_MB = 5;
  fileErrorMessage: string | null = null;
  validFiles: boolean = true;

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      console.error('Post data is not available for editing.');
    }
  }

  ngAfterViewInit(): void {
    this.initializeQuill();
  }

  private initializeQuill(): void {
    this.quillEditor = new Quill('#quill-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ]
      },
      placeholder: 'Edit your content here...',
    });

    this.quillEditor.root.innerHTML = this.post.Content;
    this.quillEditor.on('text-change', () => {
      this.post.Content = this.quillEditor.root.innerHTML;
    });
  }

  onSubmit(): void {
    if (this.post.Title.length > this.MAX_TITLE_LENGTH) {
      this.showSnackbar(`Title cannot exceed ${this.MAX_TITLE_LENGTH} characters.`, 'error');
      return;
    }

    this.postService.updatePost(this.post).subscribe({
      next: () => {
        this.uploadFiles().then(() => {
          this.closeModal();
          this.showSnackbar('Post updated successfully!', 'success');
        });
      },
      error: (error) => {
        console.error('Error updating post:', error);
        this.showSnackbar('Failed to update post.', 'error');
      }
    });
  }

  private openSnackbar(message: string, type: 'success' | 'error'): void {
    const snackbarClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: [snackbarClass],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  closeModal(): void {
    this.closeEditModal.emit(); 
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileErrorMessage = null; // Reset error message before checking files
    this.validFiles = true; // Reset validFiles before checking
    
    if (input.files) {
      const files = Array.from(input.files);
      const validFiles = files.filter(file => {
        if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
          this.fileErrorMessage = `File ${file.name} is too large. Maximum allowed size is ${this.MAX_FILE_SIZE_MB} MB.`;
          this.validFiles = false; // Set validFiles to false if any file is too large
          return false;
        }
        return true;
      });
      this.selectedFiles.push(...validFiles);
    }
  }
  private uploadFiles(): Promise<void> {
    if (this.selectedFiles.length === 0) {
      return Promise.resolve(); // If no files, resolve immediately
    }
  
    const uploadRequests = this.selectedFiles.map(file => this.uploadFile(file));
    
    return Promise.all(uploadRequests)
      .then(() => {
        this.showSnackbar('Files uploaded successfully!', 'success');
      })
      .catch(error => {
        console.error('Error uploading files:', error);
        this.showSnackbar('Failed to upload files.', 'error');
      })
      .finally(() => {
        this.selectedFiles = []; // Clear selected files after upload
      });
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

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    const snackbarClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: [snackbarClass],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
