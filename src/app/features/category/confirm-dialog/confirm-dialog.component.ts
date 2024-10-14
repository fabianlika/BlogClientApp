import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title *ngIf="!successMessage" class="text-center">Confirm</h1>
    <h1 mat-dialog-title *ngIf="successMessage" class="text-center">Success</h1>

    <div mat-dialog-content *ngIf="!successMessage" class="text-center" style="font-size: 1.2rem;">
      <p>Are you sure you want to delete this category?</p>
    </div>
    <div mat-dialog-content *ngIf="successMessage" class="text-center" style="font-size: 1.2rem;">
      <p>{{successMessage}}</p>
    </div>

    <div mat-dialog-actions class="d-flex justify-content-center" *ngIf="!successMessage">
      <button mat-button (click)="onConfirm()" class="btn btn-danger">
        <i class="bi bi-check-circle"></i> 
        Yes
      </button>
      <button mat-button (click)="onDismiss()" class="btn btn-secondary ms-2">
        <i class="bi bi-x-circle"></i> 
        No
      </button>
    </div>
    <div mat-dialog-actions class="d-flex justify-content-center" *ngIf="successMessage">
      <button mat-button (click)="onClose()" class="btn btn-primary">
        <i class="bi bi-check-circle"></i> 
        Close
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  successMessage?: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  // Method to show success message
  showSuccess(message: string): void {
    this.successMessage = message;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
