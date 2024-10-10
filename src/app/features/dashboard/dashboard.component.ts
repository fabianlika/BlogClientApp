import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showUserList: boolean = false;
  showUserRoles: boolean = false;
  showCategoryList: boolean = false;

  toggleComponent(component: string): void {
    if (component === 'userList') {
      this.showUserList = !this.showUserList;
      this.showUserRoles = false;
      this.showCategoryList = false;
    } else if (component === 'userRoles') {
      this.showUserRoles = !this.showUserRoles;
      this.showUserList = false;
      this.showCategoryList = false;
    } else if (component === 'categoryList') {
      this.showCategoryList = !this.showCategoryList;
      this.showUserList = false;
      this.showUserRoles = false;
    }
  }
}
