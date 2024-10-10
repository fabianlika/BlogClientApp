import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories$?: Observable<Category[]>;

  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories(); // Load categories initially
  }

  loadCategories(): void {
    this.categories$ = this.categoryService.getAllCategories(); // Fetch categories
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      width: '400px',
      data: { category: category }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadCategories(); // Refresh the list after editing
    });
  }

  deleteCategory(categoryId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            // Display success message inside the dialog
            const successDialog = this.dialog.open(ConfirmDialogComponent, {
              width: '300px'
            });
            successDialog.componentInstance.showSuccess('Category deleted successfully.');
            
            // Refresh the list after deletion
            this.loadCategories(); // Load categories again
          },
          error: (err) => {
            console.error('Error deleting category', err);
          }
        });
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '500px', // Adjust modal width as needed
    });

    // Subscribe to categoryAdded event from AddCategoryComponent
    dialogRef.componentInstance.categoryAdded.subscribe(() => {
      this.loadCategories(); // Reload categories on successful addition
    });
  }
}
