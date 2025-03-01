import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  visible = false;
  isLoggedIn = false;
  currentUser: any;
  pageTitle: string = "Architect Design";

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      this.updatePageTitle(); // Update the page title when the current user changes
    });
  }

  ngOnInit() {
    this.updatePageTitle(); // Update the page title on initialization
  }

  isAccessPage(): boolean {
    return !this.isLoggedIn && this.router.url === '/access';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/access']);
  }

  userHasRole(role: string): boolean {
    return this.currentUser && this.currentUser.roles && this.currentUser.roles.includes(role);
  }

  // Add this method to update the page title
  private updatePageTitle(): void {
    if (this.currentUser) {
      this.pageTitle = this.currentUser.client || "Architect Design";
    } else {
      this.pageTitle = "Architect Design";
    }
  }
}
