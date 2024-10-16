import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' } | null>(null);
  toastState = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'error'): void {
    console.log(`Toast message: ${message}, Type: ${type}`); // Debug log
    this.toastSubject.next({ message, type });
}

  
}
