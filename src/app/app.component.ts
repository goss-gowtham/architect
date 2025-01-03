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
    });
  }

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.pageTitle = user.client;
    }
  }

  isAccessPage(): boolean {
    return this.router.url === '/access';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/access']);
  }

  userHasRole(role: string): boolean {
    return this.currentUser && this.currentUser.roles && this.currentUser.roles.includes(role);
  }
}
