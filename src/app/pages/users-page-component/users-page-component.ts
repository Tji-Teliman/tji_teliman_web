// Importations nécessaires pour les composants Angular autonomes
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { Data } from '../../services/data';
import { Env } from '../../env';

// Interface pour définir la structure des données utilisateur
interface User {
  nom: string;
  prenom: string;
  genre: 'Masculin' | 'Féminin';
  email: string;
  role: 'Recruteur' | 'Prestataire' | 'Admin';
  id: number;

  // 💡 CORRECTION 1 : AJOUT DE LA PROPRIÉTÉ MANQUANTE POUR TS2339
  statut: string;
}

// Interface pour les cartes de statistiques
interface StatCard {
  title: string;
  value: number;
  cssClass: string;
}

@Component({
  selector: 'app-users-page',
  standalone: true,
  // NOTE : Si vous utilisez d'autres modules (MatIcon, MatButton, etc.) dans le HTML,
  // ils doivent être ajoutés ici.
  imports: [CommonModule , AdminHeaderComponent],
  templateUrl: './users-page-component.html',
  styleUrls: ['./users-page-component.css']
})
export class UsersPageComponent implements OnInit {

  statCards = [
    { title: 'Total', value: '0', cssClass: 'blue-card' },
    { title: 'Recruteurs', value: '0', cssClass: 'green-card' },
    { title: 'Jeunes Prestataires', value: '0', cssClass: 'orange-card' },
  ];

  // Données de simulation pour le tableau des utilisateurs
  users: User[] = [ ];

  constructor(private data:Data){}

  ngOnInit(): void {
      this.data.getData(Env.ADMIN+'utilisateurs').subscribe({
        next: (res: any) => {
          this.statCards[0].value = res.totalUtilisateurs;
          this.statCards[1].value = res.totalRecruteurs;
          this.statCards[2].value = res.totalJeunes;

          this.users = res.utilisateurs;
          console.log(res);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  blockUser(user: User): void {
    // Logique pour bloquer/débloquer l'utilisateur (toggle)
    user.statut = user.statut =='ACTIVER' ? 'DESACTIVER' : 'ACTIVER';
    const action = user.statut =='ACTIVER' ? 'bloqué' : 'débloqué';
    console.log(`L'utilisateur ${user.prenom} ${user.nom} est maintenant ${action}.`);
    if(user.statut =='DESACTIVER'){
      this.data.postData(Env.USER+'/'+user.id+'/debloquer',{}).subscribe({
        next: (res:any)=>{
          console.log(res);
        },
        error:(err:any)=>{
          console.log(err);
        }
      });
    }
    else{
      this.data.postData(Env.USER+'/'+user.id+'/bloquer',{}).subscribe({
        next: (res:any)=>{
          console.log(res);
        },
        error:(err:any)=>{
          console.log(err);
        }
      });
    }
  }
}
