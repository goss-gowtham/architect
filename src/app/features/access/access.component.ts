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
      this.authService.login(this.validateForm.value);
      this.authService.currentUser.subscribe(user => {

        if (user?.roles.includes('admin')) {
          this.router.navigate(['/admin']);
        }
        else if (user?.roles.includes('user')) {
          this.router.navigate(['/clients']);
        }
      })
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
