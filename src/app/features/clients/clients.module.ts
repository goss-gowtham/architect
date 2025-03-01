import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsRoutingModule } from './clients-routing.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ClientsComponent } from './clients.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsFormComponent } from '../../components/user-details-form/user-details-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [ClientsComponent, UserDetailsFormComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzGridModule,
    NzFlexModule,
    NzEmptyModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputModule,
    NzSwitchModule
  ]
})
export class ClientsModule { }
