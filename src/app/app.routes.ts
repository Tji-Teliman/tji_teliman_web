import { Routes } from '@angular/router';
import { DashboardComponent  } from './components/pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { UsersPageComponent } from './pages/users-page-component/users-page-component';
import { Index } from './pages/index';
import { Missions } from './pages/missions/missions';
import { Alertes } from './pages/alertes/alertes';
import { Paiements } from './pages/paiements/paiements';
import { LitigesComponent } from './pages/litiges/litiges';
import { CompetencesComponent } from './pages/competences/competences';
import { CategoriesComponent } from './pages/categories/categories';
import { MissionDetailComponent } from './pages/mission-detail/mission-detail.component';
import { CandidaturesComponent } from './pages/candidatures/candidatures.component';
import { LitigesDetailComponent } from './pages/litige-detail/litige-detail.component';
import { IndexLitigeComponent } from './pages/litiges/index-litige/index-litige.component';
import { authGuard } from './guards/auth-guard-guard';


export const routes: Routes = [
  {
    path: '',
    component: Index,
    children: [
      {path: '', component: DashboardComponent},
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
         path: 'litiges',
         component: IndexLitigeComponent,
         children:[
        {
         path: '',
         component: LitigesComponent
        
        }
        ]
      },
    

      //La liste des routes pour les competences
      {
        path: 'competences', 
        component: CompetencesComponent ,
        
      },

      //La liste des routes pour les categories
      {
        path:'categories',
        component:CategoriesComponent,
        
      }

    ],
    canActivate:[authGuard]
  },
  {
      path: 'annonce-details/:id', // Utilise le même chemin que dans alertes.ts
      component: MissionDetailComponent,
      canActivate:[authGuard]
  },
  {
    path: 'mission-detail/:id',
    component: MissionDetailComponent,
    canActivate:[authGuard]
  },
  {
    path: 'mission-candidatures/:id', // Chemin clair pour la gestion des candidatures
    component: CandidaturesComponent,
    canActivate:[authGuard]
  },
  {
    path: 'litiges/detail/:no',
    component: LitigesDetailComponent,
    canActivate:[authGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path:'**',
    redirectTo:'login'
  }
];
