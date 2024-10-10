import { Component } from '@angular/core';
import { PostPhotoService } from '../../services/post-photo.service';
import { CreatePostPhotoDto } from '../../models/create-post-photo.dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-post-photo',
  templateUrl: './upload-post-photo.component.html',
})
export class UploadPostPhotoComponent {
  selectedFiles: File[] = []; // To store selected files
  postId: string = ''; // Assume you have a way to set this

  constructor(private postPhotoService: PostPhotoService, private snackBar: MatSnackBar) {}

  // Method to handle file input changes
  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    console.log('Selected files:', this.selectedFiles);
  }

  // Method to handle form submission
  async onSubmit() {
    if (!this.postId) {
      this.snackBar.open('Post ID is not set!', 'Close', { duration: 3000 });
      return;
    }

    try {
      for (const file of this.selectedFiles) {
        const formData = new FormData();
        formData.append('FileContent', file); // Assuming your DTO has a FileContent property
        formData.append('PostId', this.postId); // Add the postId if needed

        await this.postPhotoService.uploadPostPhoto(formData).toPromise(); // Update the service method accordingly
        this.snackBar.open(`Photo uploaded successfully: ${file.name}`, 'Close', { duration: 3000 });
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
      this.snackBar.open('Failed to upload photo. Please try again.', 'Close', { duration: 3000 });
    }
  }
}
