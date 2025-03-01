import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DbService } from 'src/app/services/db.service';
import { v4 as uuidv4 } from 'uuid';
import { CardDTO } from '../../../models/clients.dto';
import { User, Roles } from '../../../models/user.dto'; // Ensure Roles is imported
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service'; 
import { AuthService } from '../../../services/auth.service'; // Ensure AuthService is imported
import {ClipboardModule} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.scss',
  standalone: false
})
export class ManageProjectsComponent implements OnInit {
  userId: string | null = null;
  user: User | null = null;
  projects: CardDTO[] = [];
  editProjectForm: FormGroup;
  addProjectForm: FormGroup;
  isEditModalVisible = false;
  originalProject: CardDTO | null = null; // Add this variable to store the original project
  showResetPassword = false; // Add this variable to control the visibility of the password input field
  newPassword: string = ''; // Add this variable to store the new password
  isMaster: boolean = false; // Add this variable to check for master entitlement
  isAdmin: boolean = false; // Add this variable to check for admin entitlement

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Add Router to constructor
    private projectService: ProjectService,
    private userService: UserService, // Add constructor
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private dbService: DbService,
    private modal: NzModalService,
    private authService: AuthService // Add AuthService to constructor
  ) {
    this.editProjectForm = this.fb.group({
      projectId: ['', Validators.required],
      project: ['', Validators.required],
      desc: ['', Validators.required],
      pay: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      thumbnail: [''],
      paid: [false],
      thumbnailFile: [null]
    });

    this.addProjectForm = this.fb.group({
      project: ['', Validators.required],
      desc: ['', Validators.required],
      pay: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      file: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.userService.getUser(this.userId).subscribe(user => { // Update method
          this.user = user;
          this.projects = user?.projects || [];
        });
      }
    });
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.isMaster = currentUser.roles.includes(Roles.master);
      this.isAdmin = currentUser.roles.includes(Roles.admin);
    }
  }

  onProjectFileChange(event: any) {
    const file = event.target.files[0];
    if (file.size > 50 * 1024 * 1024) {
      this.notification.error('Error', 'File size exceeds 50MB');
      event.target.value = null; // Reset the file input
      return;
    }
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!acceptedTypes.includes(file.type)) {
      this.notification.error('Error', 'Invalid file type. Only PDF and image files are accepted.');
      event.target.value = null; // Reset the file input
      return;
    }
    this.addProjectForm.patchValue({ file });
  }

  addProjectToUser() {
    const { project, desc, pay } = this.addProjectForm.value;
    if (this.userId && this.addProjectForm.valid) {
        const filePath = `projects/${this.userId}/${uuidv4()}_${this.addProjectForm.value.file.name}`;
        this.dbService.uploadFile(this.addProjectForm.value.file, filePath).subscribe((fileUrl) => {
            const projectId = uuidv4();
            const newProject: CardDTO = {
                projectId,
                project,
                desc,
                pay,
                thumbnail: '',
                file: fileUrl,
                paid: false
            };
            this.projectService.addProjectToUser(this.userId!, newProject).subscribe(() => {
                this.notification.success('Success', 'Asset added successfully');
                this.projects.push(newProject);
                this.addProjectForm.reset();
            }, (error) => {
                console.error("Error adding asset:", error);
            });
        }, (error) => {
            console.error("Error uploading file:", error);
        });
    }
  }

  // Add this method to check if the form values have changed
  hasFormChanged(): boolean {
    if (!this.originalProject) return false;
    const { projectId, project, desc, pay, paid } = this.editProjectForm.value;
    return (
      projectId !== this.originalProject.projectId ||
      project !== this.originalProject.project ||
      desc !== this.originalProject.desc ||
      pay !== this.originalProject.pay ||
      paid !== this.originalProject.paid ||
      this.editProjectForm.get('thumbnailFile')?.value !== null
    );
  }

  // Update the editProject method to check if the form values have changed
  editProject() {
    if (!this.hasFormChanged()) {
      this.isEditModalVisible = false;
      return;
    }

    const { projectId, project, desc, pay, paid } = this.editProjectForm.value;
    const thumbnailFile = this.editProjectForm.get('thumbnailFile')?.value;
    if (this.userId && this.editProjectForm.valid) {
        const updateProjectData = (thumbnailUrl: string) => {
            const updatedProject: CardDTO = {
                projectId,
                project,
                desc,
                pay,
                thumbnail: thumbnailUrl,
                file: this.projects.find(p => p.projectId === projectId)?.file || '',
                paid
            };
            this.projectService.updateProject(this.userId!, updatedProject).subscribe(() => {
                this.notification.success('Success', 'Project updated successfully');
                const index = this.projects.findIndex(p => p.projectId === projectId);
                if (index !== -1) {
                    this.projects[index] = updatedProject;
                }
                this.editProjectForm.reset();
                this.isEditModalVisible = false;
            }, (error) => {
                console.error("Error updating project:", error);
            });
        };

        if (thumbnailFile) {
            const filePath = `thumbnails/${this.userId}/${uuidv4()}_${thumbnailFile.name}`;
            this.dbService.uploadFile(thumbnailFile, filePath).subscribe((thumbnailUrl) => {
                updateProjectData(thumbnailUrl);
            }, (error) => {
                console.error("Error uploading thumbnail:", error);
            });
        } else {
            updateProjectData(this.editProjectForm.get('thumbnail')?.value || '');
        }
    }
  }

  markAsPaid() {
    if (this.isAdmin) {
      this.editProjectForm.patchValue({ paid: true });
    } else {
      this.notification.error('Error', 'Only users with admin entitlement can mark as paid.');
    }
  }

  onThumbnailFileChange(event: any) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.notification.error('Error', 'Thumbnail size exceeds 2MB');
      event.target.value = null; // Reset the file input
      return;
    }
    const acceptedTypes = ['image/jpeg', 'image/png'];
    if (!acceptedTypes.includes(file.type)) {
      this.notification.error('Error', 'Invalid file type. Only image files (JPEG, PNG) are accepted.');
      event.target.value = null; // Reset the file input
      return;
    }
    this.editProjectForm.patchValue({ thumbnailFile: file });
  }

  deleteProject(projectId: string) {
    if (this.userId) {
      this.modal.confirm({
        nzTitle: "Action can't be undone",
        nzContent: 'Are you sure to remove this asset and its associated files?',
        nzOnOk: () => {
          this.projectService.deleteProject(this.userId!, projectId).subscribe(() => {
            this.notification.success('Success', 'Asset and its associated files removed successfully');
            this.projects = this.projects.filter(p => p.projectId !== projectId);
          }, (error: any) => {
            this.notification.error('Error', 'Error deleting project');
            console.error("Error deleting project:", error);
          });
        }
      });
    }
  }

  // Update the selectProjectForEdit method to store the original project
  selectProjectForEdit(project: CardDTO) {
    this.editProjectForm.patchValue(project);
    this.originalProject = { ...project }; // Store the original project
    this.isEditModalVisible = true;
  }

  // Add this method to toggle the visibility of the password input field
  toggleResetPassword() {
    this.showResetPassword = !this.showResetPassword;
  }

  // Add this method to handle the password reset
  resetPassword() {
    if (this.newPassword && this.userId) {
      this.userService.updateUserPassword(this.userId, this.newPassword).subscribe(() => {
        this.notification.success('Success', 'Password updated successfully');
        this.showResetPassword = false;
        this.newPassword = '';
      }, (error) => {
        console.error("Error updating password:", error);
      });
    }
  }

  handleCancelEdit() {
    this.isEditModalVisible = false;
  }

  navigateBack() {
    this.router.navigate(['/admin']);
  }
}
