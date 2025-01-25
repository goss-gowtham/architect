import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.dto';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-details-form.component.scss'],
  standalone: false
})
export class UserDetailsFormComponent implements OnInit {
  user!: User;
  userDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private modal: NzModalRef) {
    this.user = this.modal.getConfig().nzData.user; // Get user data from nzData
    this.userDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.userDetailsForm.patchValue({
        email: this.user.email,
        phone: this.user.phone
      });
    }
  }

  getUserDetails(): User {
    return {
      ...this.user,
      email: this.userDetailsForm.value.email,
      phone: this.userDetailsForm.value.phone
    };
  }
}