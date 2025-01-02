import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './features/access/access.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('../app/features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard], 
    data: { roles: ['admin'] }
  },
  {
    path: 'clients',
    loadChildren: () => import('../app/features/clients/clients.module').then(m => m.ClientsModule),
    canActivate: [AuthGuard], 
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'access',
    component: AccessComponent
  },
  {
    path: '',
    redirectTo: '/access',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'access',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
