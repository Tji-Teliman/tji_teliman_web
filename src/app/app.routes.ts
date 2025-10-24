import { Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard';

export const routes: Routes = [
  {
    // L'URL pour accéder au tableau de bord sera : /dashboard
    path: 'dashboard',
    component: DashboardComponent,
  },
];
