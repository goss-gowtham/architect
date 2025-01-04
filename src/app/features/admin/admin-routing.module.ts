import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'manage-projects', component: ManageProjectsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }