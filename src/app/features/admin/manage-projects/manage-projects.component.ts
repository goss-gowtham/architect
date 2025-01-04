import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service'; // Add import
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CardDTO } from '../../../models/clients.dto';
import { User } from '../../../models/user.dto';
import { v4 as uuidv4 } from 'uuid';

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
    private projectService: ProjectService,
    private userService: UserService, // Add constructor
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {
    this.editProjectForm = this.fb.group({
      projectId: ['', Validators.required],
      project: ['', Validators.required],
      desc: ['', Validators.required],
      pay: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      thumbnail: [''],
      paid: [false]
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
      // this.dbService.uploadFile(this.addProjectForm.value.file, filePath).subscribe((fileUrl) => {
        const projectId = uuidv4();
        const newProject: CardDTO = {
          projectId,
          project,
          desc,
          pay,
          thumbnail: '',
          file: 'https://firebasestorage.googleapis.com/v0/b/architect-design-7.firebasestorage.app/o/projects%2F0a3ad79c-e8fc-4084-85e9-0d02919a2764%2F02de3a06-3185-4fc3-b76b-29e9e546951e_PearsonVue.png?alt=media&token=d8006cbd-97a4-4a6b-83df-383e66dab9bb',
          paid: false
        };
        this.projectService.addProjectToUser(this.userId!, newProject).subscribe(() => {
          this.notification.success('Success', 'Project added successfully');
          this.projects.push(newProject);
          this.addProjectForm.reset();
        }, (error) => {
          console.error("Error adding project:", error);
        });
      // }, (error) => {
      //   console.error("Error uploading file:", error);
      // });
    }
  }

  editProject() {
    const { projectId, project, desc, pay, thumbnail, paid } = this.editProjectForm.value;
    if (this.userId && this.editProjectForm.valid) {
      const updatedProject: CardDTO = {
        projectId,
        project,
        desc,
        pay,
        thumbnail,
        file: this.projects.find(p => p.projectId === projectId)?.file || '',
        paid
      };
      this.projectService.addProjectToUser(this.userId!, updatedProject).subscribe(() => {
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
    }
  }

  deleteProject(projectId: string) {
    if (this.userId) {
      this.projectService.deleteProject(this.userId, projectId).subscribe(() => {
        this.notification.success('Success', 'Project deleted successfully');
        this.projects = this.projects.filter(p => p.projectId !== projectId);
      }, (error: any) => {
        console.error("Error deleting project:", error);
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
}
