import { Routes } from '@angular/router';
import { DashboardComponent  } from './components/pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { UsersPageComponent } from './pages/users-page-component/users-page-component';
import { Index } from './pages/index';
import { Missions } from './pages/missions/missions';
import { Alertes } from './pages/alertes/alertes';
import { Paiements } from './pages/paiements/paiements';
import { Litiges } from './pages/litiges/litiges';
import { Competences } from './pages/competences/competences';
import { Categories } from './pages/categories/categories';
export const routes: Routes = [
  {
    path: '',
    component: Index,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},

      //Pour les routes des utilisateurs
      {
        path:'users',
        component:UsersPageComponent,
        children:[

        ]
      },

      //Pour les routes Missions
      {
        path:'missions',
        component:Missions,
        children:[
        ]
      },

      //Les routes pour Alertes :
      {
        path:'alerts',
        component:Alertes,
        children:[
        ]
      },

      //LA liste des routes pour les paiements
      {
        path:'payments',
        component:Paiements,
        children:[

        ]
      },

      //La liste des routes pour les litiges
      {
        path:'litiges',
        component:Litiges,
        children:[

        ]
      },

      //La liste des routes pour les competences
      {
        path:'competences',
        component:Competences,
        children:[

        ]
      },

      //La liste des routes pour les categories
      {
        path:'categories',
        component:Categories,
        children:[

        ]
      }

    ]
  },
  {
    path: 'login',
    component: Login,
  },

  {
    path: '**',
    redirectTo: 'login',
  }
];
