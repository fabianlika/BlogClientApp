import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
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
  categories: Category[] = [];
  pagedCategories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  loading: boolean = true; // Add loading variable

  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true; // Set loading to true
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
        this.updatePagedCategories();
        this.loading = false; // Set loading to false after data is loaded
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.loading = false; // Ensure loading is false on error
      }
    });
  }

  updatePagedCategories(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCategories = this.categories.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagedCategories();
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      width: '400px',
      data: { category: category }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadCategories();
    });
  }

  deleteCategory(categoryId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',  
      height: '200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            const successDialog = this.dialog.open(ConfirmDialogComponent, {
              width: '300px'
            });
            successDialog.componentInstance.showSuccess('Category deleted successfully.');
            this.loadCategories();
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
      width: '500px'
    });

    dialogRef.componentInstance.categoryAdded.subscribe(() => {
      this.loadCategories();
    });
  }
}
