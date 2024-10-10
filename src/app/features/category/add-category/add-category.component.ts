import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnDestroy {

  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;

  @Output() categoryAdded = new EventEmitter<void>();

  constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddCategoryComponent> ,
    private snackBar: MatSnackBar  // Add MatDialogRef
  ) {
    this.model = {
      name: '',
      url: ''
    };
  }

  onFormSubmit() {
    this.addCategorySubscription = this.categoryService.addCategory(this.model)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Category added successfully!', 'Close', { duration: 3000 });
          this.categoryAdded.emit(); // Emit the event here
          this.dialogRef.close(true);
        }
      });
  }
  
  closeDialog(): void {
    this.dialogRef.close();  // Close dialog manually
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }
}
