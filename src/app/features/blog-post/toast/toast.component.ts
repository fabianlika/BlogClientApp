import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | null = null;
  isVisible: boolean = false;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState.subscribe((toastState) => {
      if (toastState) {
        this.toastMessage = toastState.message;
        this.toastType = toastState.type;
        this.isVisible = true;
  
        // Add a class to make it visible
        setTimeout(() => {
          this.isVisible = false; // Hide toast after 3 seconds
          this.toastMessage = null;
          this.toastType = null;
        }, 3000);
      }
    });
  }
  

  closeToast(): void {
    this.isVisible = false;
    this.toastMessage = null; // Clear the message when manually closed
    this.toastType = null; // Clear type when manually closed
  }
}
