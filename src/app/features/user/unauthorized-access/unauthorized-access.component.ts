import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.css']
})
export class UnauthorizedAccessComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['']); // Navigate to your home route
  }
}
