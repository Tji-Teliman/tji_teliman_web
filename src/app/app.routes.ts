import { Routes } from '@angular/router';
import { DashboardComponent  } from './components/pages/dashboard/dashboard';
import { Login } from './pages/login/login';
export const routes: Routes = [
  {
    // L'URL pour accéder au tableau de bord sera : /dashboard
    path: 'dashboard',
    component: DashboardComponent,
  },
   {
    // L'URL pour accéder au tableau de bord sera : /dashboard
    path: 'login',
    component: Login,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' // Assure que la redirection se fait uniquement si le chemin est exactement vide
  }
];
