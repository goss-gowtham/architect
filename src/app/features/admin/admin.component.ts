import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { v4 as uuidv4 } from 'uuid';
import { User, Roles } from '../../models/user.dto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: false
})
export class AdminComponent implements OnInit {
  isMaster: boolean = false;
  userData: User[] = [];
  filteredUserData: User[] = [];
  addUserForm: FormGroup;
  addClientForm: FormGroup;
  logoFile: File | null = null;
  roles = Object.values(Roles);
  clients: any = [];
  searchValue: string = '';

  constructor(
    private fb: FormBuilder,
    private dbService: DbService, 
    private authService: AuthService,
    private notification: NzNotificationService
  ) {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      userRoles: [[], Validators.required],
      client: [[], Validators.required]
    });

    this.addClientForm = this.fb.group({
      clientName: ['', Validators.required],
      logo: [null, Validators.required]
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.roles.includes(Roles.Master)) {
      this.isMaster = true;
    }
    this.getAllUsers();
    this.getClients();
  }

  getClients() {
    this.dbService.getData('clients').subscribe((clients: any) => {
      this.clients = Object.keys(clients);
      console.log(clients);
    }, (error) => {
      console.error("Error fetching clients:", error);
    });
  }

  addUser() {
    const { username, password, userRoles, client } = this.addUserForm.value;
    const rolesValue = userRoles ? userRoles : [Roles.User];
    const currentUser = this.authService.currentUserValue;
    const clientValue = client || currentUser?.client || '';
    const userId = uuidv4();
    const newUser: User = {
      id: userId,
      username: username,
      password: password,
      roles: rolesValue,
      client: clientValue
    };
    this.dbService.addUser(newUser).subscribe(() => {
      this.notification.success('Success', 'User added successfully');
      this.addUserForm.reset();
      this.getAllUsers();
    }, (error) => {
      console.error("Error adding user:", error);
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
    this.dbService.getUsers(client).subscribe((users) => {
      this.userData = users;
      this.filteredUserData = users;
    }, (error) => {
      console.error("Error fetching users:", error);
    });
  }

  deleteUser(userId: string) {
    this.dbService.deleteUser(userId).subscribe(() => {
      console.log("User deleted successfully");
      this.getAllUsers();
    }, (error) => {
      console.error("Error deleting user:", error);
    });
  }

  searchUsers() {
    this.filteredUserData = this.userData.filter(user => 
      user.username.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      user.roles.some(role => role.toLowerCase().includes(this.searchValue.toLowerCase()))
    );
    console.log(this.filteredUserData, this.userData);
  }
}
