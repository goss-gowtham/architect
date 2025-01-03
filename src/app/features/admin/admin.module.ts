import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormsModule } from '@angular/forms';
import { AddProjectComponent } from './add-project/add-project.component';

@NgModule({
  declarations: [AdminComponent, AddProjectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NzButtonModule,
    NzGridModule,
    NzFlexModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzTabsModule,
    NzIconModule,
    NzCardModule,
    NzDescriptionsModule
  ],
  providers: [NzNotificationService]
})
export class AdminModule { }
