import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',    // Adjust width as needed
      height: '200px',   // Adjust height as needed
      data: { message },
      panelClass: 'confirm-dialog-container'
    });

    return dialogRef.afterClosed().toPromise();
  }
}
