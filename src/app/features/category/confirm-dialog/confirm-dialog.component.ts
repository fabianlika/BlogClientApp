import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title *ngIf="!successMessage">Confirm</h1>
    <h1 mat-dialog-title *ngIf="successMessage">Success</h1>

    <div mat-dialog-content *ngIf="!successMessage">
      <p>Are you sure you want to delete this category?</p>
    </div>
    <div mat-dialog-content *ngIf="successMessage">
      <p>{{successMessage}}</p>
    </div>

    <div mat-dialog-actions *ngIf="!successMessage">
      <button mat-button (click)="onConfirm()">Yes</button>
      <button mat-button (click)="onDismiss()">No</button>
    </div>
    <div mat-dialog-actions *ngIf="successMessage">
      <button mat-button (click)="onClose()">Close</button>
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
