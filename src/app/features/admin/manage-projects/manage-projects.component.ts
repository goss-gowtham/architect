import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DbService } from 'src/app/services/db.service';
import { v4 as uuidv4 } from 'uuid';
import { CardDTO } from '../../../models/clients.dto';
import { User } from '../../../models/user.dto';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service'; 

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  standalone: false
})
export class ManageProjectsComponent implements OnInit {
  userId: string | null = null;
  user: User | null = null;
  projects: CardDTO[] = [];
  editProjectForm: FormGroup;
  addProjectForm: FormGroup;
  isEditModalVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Add Router to constructor
    private projectService: ProjectService,
    private userService: UserService, // Add constructor
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private dbService: DbService,
    private modal: NzModalService
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
  }

  onProjectFileChange(event: any) {
    const file = event.target.files[0];
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
          this.notification.success('Success', 'Project added successfully');
          this.projects.push(newProject);
          this.addProjectForm.reset();
        }, (error) => {
          console.error("Error adding project:", error);
        });
      }, (error) => {
        console.error("Error uploading file:", error);
      });
    }
  }

  editProject() {
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

onThumbnailFileChange(event: any) {
    const file = event.target.files[0];
    this.editProjectForm.patchValue({ thumbnailFile: file });
}

  deleteProject(projectId: string) {
    if (this.userId) {
      this.modal.confirm({
        nzTitle: "Action can't be undone",
        nzContent: 'Are you sure to remove this project and its associated file?',
        nzOnOk: () => {
          this.projectService.deleteProject(this.userId!, projectId).subscribe(() => {
            this.notification.success('Success', 'Project and its associated file removed successfully');
            this.projects = this.projects.filter(p => p.projectId !== projectId);
          }, (error: any) => {
            this.notification.error('Error', 'Error deleting project');
            console.error("Error deleting project:", error);
          });
        }
      });
    }
  }

  selectProjectForEdit(project: CardDTO) {
    this.editProjectForm.patchValue(project);
    this.isEditModalVisible = true;
  }

  handleCancelEdit() {
    this.isEditModalVisible = false;
  }

  navigateBack() {
    this.router.navigate(['/admin']);
  }
}
