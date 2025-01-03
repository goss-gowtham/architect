import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../../../services/db.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { v4 as uuidv4 } from 'uuid';
import { CardDTO } from '../../../models/clients.dto';
import { User } from '../../../models/user.dto';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  standalone: false
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  projectFile: File | null = null;
  userId: string | null = null;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private dbService: DbService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.addProjectForm = this.fb.group({
      userId: ['', Validators.required],
      project: ['', Validators.required],
      desc: ['', Validators.required],
      pay: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.addProjectForm.patchValue({ userId: this.userId });
        this.dbService.getUser(this.userId).subscribe(user => {
          this.user = user;
        });
      }
    });
  }

  onProjectFileChange(event: any) {
    this.projectFile = event.target.files[0];
    this.addProjectForm.patchValue({ file: this.projectFile });
  }

  addProjectToUser() {
    const { userId, project, desc, pay } = this.addProjectForm.value;
    if (this.projectFile) {
      const filePath = `projects/${userId}/${uuidv4()}_${this.projectFile.name}`;
      this.dbService.uploadFile(this.projectFile, filePath).subscribe((fileUrl) => {
        const newProject: CardDTO = {
          project,
          desc,
          pay,
          thumbnail: '',
          file: fileUrl
        };
        this.dbService.addProjectToUser(userId, newProject).subscribe(() => {
          this.notification.success('Success', 'Project added to user successfully');
          this.addProjectForm.reset();
          this.projectFile = null;
          this.router.navigate(['/admin']);
        }, (error) => {
          console.error("Error adding project to user:", error);
        });
      }, (error) => {
        console.error("Error uploading project file:", error);
      });
    }
  }
}
