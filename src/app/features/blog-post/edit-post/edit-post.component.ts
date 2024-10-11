import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private postService: PostService,
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
    this.postService.updatePost(this.post).subscribe(() => {
      this.snackBar.open('Post updated successfully!', 'Close', { duration: 3000 });
    }, (error) => {
      console.error('Error updating post:', error);
      this.snackBar.open('Failed to update post.', 'Close', { duration: 3000 });
    });
  }

  closeModal() {
    this.closeEditModal.emit(); 
  }
}
