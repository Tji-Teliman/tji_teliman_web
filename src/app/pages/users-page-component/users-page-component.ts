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
  isBlocked: boolean;
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

  // Données de simulation pour les cartes statistiques
  statCards: StatCard[] = [
    { title: 'Total', value: 2031, cssClass: 'blue-card' },
    { title: 'Recruteurs', value: 438, cssClass: 'green-card' },
    { title: 'Jeunes Prestataires', value: 1280, cssClass: 'orange-card' },
  ];

  // Données de simulation pour le tableau des utilisateurs
  users: User[] = [
    // 💡 CORRECTION 2 : AJOUT DE LA PROPRIÉTÉ isBlocked aux données initiales
    { nom: 'Bagayoko', prenom: 'Amadou', genre: 'Masculin', email: 'abagayoko304@gmail.com', role: 'Recruteur', id: 1, isBlocked: false },
    { nom: 'Diop', prenom: 'Fatou', genre: 'Féminin', email: 'f.diop@example.com', role: 'Prestataire', id: 2, isBlocked: true },
    { nom: 'Traoré', prenom: 'Issa', genre: 'Masculin', email: 'issa.traore@mail.net', role: 'Recruteur', id: 3, isBlocked: false },
    { nom: 'Kone', prenom: 'Aicha', genre: 'Féminin', email: 'a.kone@dev.com', role: 'Prestataire', id: 4, isBlocked: false },
    { nom: 'Diallo', prenom: 'Moussa', genre: 'Masculin', email: 'moussa.diallo@pro.co', role: 'Recruteur', id: 5, isBlocked: true },
    { nom: 'Camara', prenom: 'Mariam', genre: 'Féminin', email: 'mariam.camara@web.fr', role: 'Prestataire', id: 6, isBlocked: false },
    { nom: 'Sow', prenom: 'Ousmane', genre: 'Masculin', email: 'o.sow@tech.ci', role: 'Recruteur', id: 7, isBlocked: false },
    { nom: 'Coulibaly', prenom: 'Aminata', genre: 'Féminin', email: 'a.couli@data.io', role: 'Prestataire', id: 8, isBlocked: false },
    { nom: 'Kane', prenom: 'Sekou', genre: 'Masculin', email: 's.kane@service.com', role: 'Recruteur', id: 9, isBlocked: false },
  ];

  constructor(private data:Data){}

  ngOnInit(): void {
      this.data.getData(Env.ADMIN+'utilisateurs').subscribe({
        next(res) {
            console.log(res)
        },
        error(err) {
            console.log(err);
        },
      })
  }

  blockUser(user: User): void {
    // Logique pour bloquer/débloquer l'utilisateur (toggle)
    user.isBlocked = !user.isBlocked;
    const action = user.isBlocked ? 'bloqué' : 'débloqué';
    console.log(`L'utilisateur ${user.prenom} ${user.nom} est maintenant ${action}.`);
    // Ici, vous ajouteriez l'appel API.

    // 💡 CORRECTION 3 : SUPPRESSION DES ASSIGNATIONS QUI CAUSAIENT L'ERREUR TS2304
    // Les statistiques sont déjà dans 'statCards' et ne doivent pas être ré-assignées ici.
  }
}
