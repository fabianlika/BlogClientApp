import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // MatDialog dependencies
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  editCategorySubscription?: Subscription;
  category: Category;

  constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<EditCategoryComponent>, // MatDialogRef to control the dialog
    @Inject(MAT_DIALOG_DATA) public data: { category: Category }, // Inject MAT_DIALOG_DATA to receive data
    private snackBar: MatSnackBar // Inject MatSnackBar for success message
  ) {
    this.category = { ...data.category }; // Clone the data
  }

  ngOnDestroy(): void {
    this.editCategorySubscription?.unsubscribe();
  }

  // Method to close the dialog if the user doesn't want to edit
  closeDialog(): void {
    this.dialogRef.close(); // Just close the dialog
  }

  onFormSubmit(): void {
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category.Name,
      url: this.category.Url
    };

    this.editCategorySubscription = this.categoryService.updateCategory(this.category.CategoryId, updateCategoryRequest)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Category updated successfully', 'Close', {
            duration: 3000, // Success message duration
          });
          this.dialogRef.close(true); // Close the dialog and pass 'true' to indicate success
        }
      });
  }

  ngOnInit(): void { }
}
