import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostPhotoService } from '../services/post-photo.service'; // Import your post photo service

declare var tinymce: any;

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit, AfterViewInit {
  @ViewChild('postForm', { static: false }) postForm!: NgForm;
  @Input() post!: Post;
  @Output() closeEditModal: EventEmitter<void> = new EventEmitter<void>(); // Renamed EventEmitter

  selectedFiles: File[] = []; // Store selected files

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService, // Inject the post photo service
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      console.error('Post data is not available for editing.');
    }
  }

  ngAfterViewInit(): void {
    tinymce.init({
      selector: 'textarea',
      plugins: 'link image lists',
      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | link image',
      height: 300,
      setup: (editor: any) => {
        editor.on('change', () => {
          this.post.Content = editor.getContent();
        });
        editor.setContent(this.post.Content);
      }
    });
  }

  onSubmit() {
    // First update the post
    this.postService.updatePost(this.post).subscribe(() => {
      this.snackBar.open('Post updated successfully!', 'Close', { duration: 3000 });
      
      // After updating the post, upload the files
      this.uploadFiles();
    }, (error) => {
      console.error('Error updating post:', error);
      this.snackBar.open('Failed to update post.', 'Close', { duration: 3000 });
    });
  }

  closeModal() {
    this.closeEditModal.emit(); 
  }

  replaceFiles() {
    // Trigger the file input to open the file explorer
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Add selected files to the existing selectedFiles array
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
    }
  }

  uploadFiles() {
    // Ensure no duplicate uploads by clearing any previous upload results
    for (const file of this.selectedFiles) {
      const formData = new FormData();
      formData.append('FileName', file.name);
      formData.append('FileType', file.type);
      formData.append('FileContent', file);
      formData.append('PostId', this.post.PostId);

      this.postPhotoService.uploadPostPhoto(formData).subscribe(() => {
        this.snackBar.open('Files uploaded successfully!', 'Close', { duration: 3000 });
      }, (error) => {
        console.error('Error uploading files:', error);
        this.snackBar.open('Failed to upload files.', 'Close', { duration: 3000 });
      });
    }
    // Optionally clear the selected files after upload if needed
    this.selectedFiles = []; // Clear selected files after upload
  }
}
