import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { UserService } from '../../services/user.service';
import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { v4 as uuidv4 } from 'uuid';
import { User, Roles } from '../../models/user.dto';
import { NzModalService } from 'ng-zorro-antd/modal'; // Add import

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: false
})
export class AdminComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset!: NzTabSetComponent;
  isMaster: boolean = false;
  userData: User[] = [];
  filteredUserData: User[] = [];
  addUserForm: FormGroup;
  addClientForm: FormGroup;
  logoFile: File | null = null;
  roles = Object.values(Roles);
  clients: any = [];
  searchValue: string = '';
  selectedUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dbService: DbService,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService
  ) {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      userRoles: [[]],
      client: [[]]
    });

    this.addClientForm = this.fb.group({
      clientName: ['', Validators.required],
      logo: [null, Validators.required]
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.roles.includes(Roles.master)) {
      this.isMaster = true;
    }
    console.log(currentUser, this.isMaster);
    this.getAllUsers();
    this.getClients();
  }

  getClients() {
    this.dbService.getClients().subscribe((clients: any) => {
      this.clients = Object.keys(clients);
    }, (error) => {
      console.error("Error fetching clients:", error);
    });
  }

  addUser() {
    const { username, password, userRoles, client } = this.addUserForm.value;
    const rolesValue = this.isMaster ? userRoles : [Roles.user];
    const currentUser = this.authService.currentUserValue;
    const clientValue = this.isMaster ? client : currentUser?.client || '';
    const userId = uuidv4();
    const newUser: User = {
      id: userId,
      username: username,
      password: password,
      roles: rolesValue,
      client: clientValue,
      projects: []
    };
    this.userService.addUser(newUser).subscribe(() => {
      this.notification.success('Success', 'User added successfully');
      this.addUserForm.reset();
      this.getAllUsers();
    }, (error) => {
      if (error.message === 'Username already exists') {
        this.notification.error('Error', 'Username already exists');
      } else {
        console.error("Error adding user:", error);
      }
    });
  }

  addClient() {
    const { clientName } = this.addClientForm.value;
    if (this.logoFile) {
      const logoPath = `logos/${uuidv4()}_${this.logoFile.name}`;
      this.dbService.uploadFile(this.logoFile, logoPath).subscribe((logoUrl) => {
        this.dbService.addClient(clientName, logoUrl).subscribe(() => {
          this.notification.success('Success', 'Client added successfully');
          this.addClientForm.reset();
          this.logoFile = null;
        }, (error) => {
          console.error("Error adding client:", error);
        });
      }, (error) => {
        console.error("Error uploading logo:", error);
      });
    }
  }

  onLogoFileChange(event: any) {
    this.logoFile = event.target.files[0];
    this.addClientForm.patchValue({ logo: this.logoFile });
  }

  getAllUsers() {
    const currentUser = this.authService.currentUserValue;
    const client = this.isMaster ? null : currentUser?.client || '';
    this.userService.getUsers(client).subscribe((users) => {
      this.userData = users;
      this.filteredUserData = users;
    }, (error) => {
      console.error("Error fetching users:", error);
    });
  }

  deleteUser(userId: string) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.id === userId) {
      this.notification.error('Error', 'You cannot delete your own user data');
      return;
    }
    this.modal.confirm({
      nzTitle: "Action can't be undone",
      nzContent: 'Are you sure to remove this user and their associated projects?',
      nzOnOk: () => {
        this.userService.deleteUser(userId).subscribe(() => {
          this.notification.success('Success', 'User and their associated projects removed successfully');
          this.getAllUsers();
        }, (error) => {
          this.notification.error('Error', 'Error deleting user');
          console.error("Error deleting user:", error);
        });
      }
    });
  }

  searchUsers() {
    this.filteredUserData = this.userData.filter(user => 
      user.username.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      user.roles.some(role => role.toLowerCase().includes(this.searchValue.toLowerCase()))
    );
  }

  navigateToManageProjects(userId: string) {
    this.router.navigate(['/admin/manage-projects'], { queryParams: { userId } });
  }
}
