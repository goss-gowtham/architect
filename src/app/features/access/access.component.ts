import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss',
  standalone: false
})
export class AccessComponent {
  
  validateForm;
  isLoggedIn = false;
  loginError: boolean = false;

  constructor(public fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.validateForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });

    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.authService.login(this.validateForm.value).subscribe(loginSuccess => {
        if (loginSuccess) {
          this.authService.currentUser.subscribe(user => {
            if (user?.roles.includes('admin') || user?.roles.includes('master')) {
              this.router.navigate(['/admin']);
            } else if (user?.roles.includes('user') || user?.roles.includes('master')) {
              this.router.navigate(['/dashboard']);
            }
          });
          this.loginError = false;
        } else {
          this.loginError = true;
        }
      }, () => {
        this.loginError = true;
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

}
