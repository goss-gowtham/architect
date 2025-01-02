import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsRoutingModule } from './clients-routing.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ClientsComponent } from './clients.component';
import {NzButtonModule } from 'ng-zorro-antd/button'
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [ClientsComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzGridModule
  ]
})
export class ClientsModule { }
