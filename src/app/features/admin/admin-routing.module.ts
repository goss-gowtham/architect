import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddProjectComponent } from './add-project/add-project.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'add-project', component: AddProjectComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }