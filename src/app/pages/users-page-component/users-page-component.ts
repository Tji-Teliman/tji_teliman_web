// Importations nécessaires pour les composants Angular autonomes
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface pour définir la structure des données utilisateur
interface User {
nom: string;
prenom: string;
genre: 'Masculin' | 'Féminin';
email: string;
role: 'Recruteur' | 'Prestataire' | 'Admin';
id: number;
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
imports: [CommonModule],
templateUrl: './users-page-component.html',
styleUrls: ['./users-page-component.css'] // Notez l'utilisation de styleUrls pour le CSS
})
export class UsersPageComponent {
// Données de simulation pour les cartes statistiques
statCards: StatCard[] = [
{ title: 'Total', value: 2031, cssClass: 'blue-card' },
{ title: 'Recruteurs', value: 438, cssClass: 'green-card' },
{ title: 'Jeunes Prestataires', value: 1280, cssClass: 'orange-card' },
];

// Données de simulation pour le tableau des utilisateurs
users: User[] = [
{ nom: 'Bagayoko', prenom: 'Amadou', genre: 'Masculin', email: 'abagayoko304@gmail.com', role: 'Recruteur', id: 1 },
{ nom: 'Diop', prenom: 'Fatou', genre: 'Féminin', email: 'f.diop@example.com', role: 'Prestataire', id: 2 },
{ nom: 'Traoré', prenom: 'Issa', genre: 'Masculin', email: 'issa.traore@mail.net', role: 'Recruteur', id: 3 },
{ nom: 'Kone', prenom: 'Aicha', genre: 'Féminin', email: 'a.kone@dev.com', role: 'Prestataire', id: 4 },
{ nom: 'Diallo', prenom: 'Moussa', genre: 'Masculin', email: 'moussa.diallo@pro.co', role: 'Recruteur', id: 5 },
{ nom: 'Camara', prenom: 'Mariam', genre: 'Féminin', email: 'mariam.camara@web.fr', role: 'Prestataire', id: 6 },
{ nom: 'Sow', prenom: 'Ousmane', genre: 'Masculin', email: 'o.sow@tech.ci', role: 'Recruteur', id: 7 },
{ nom: 'Coulibaly', prenom: 'Aminata', genre: 'Féminin', email: 'a.couli@data.io', role: 'Prestataire', id: 8 },
{ nom: 'Kane', prenom: 'Sekou', genre: 'Masculin', email: 's.kane@service.com', role: 'Recruteur', id: 9 },
];

// Fonction appelée lorsque l'utilisateur clique sur le bouton "Bloquer"
blockUser(user: User): void {}
// console.log(Tentative de blocage de l'utilisateur : ${user.nom} ${user.prenom} (ID: ${user.id}));
// Ici, vous implémenteriez la logique réelle pour interagir avec une API pour bloquer l'utilisateur.
// Pour l'instant, c'est uniquement une simulation de console.
// alert(Confirmation : L'utilisateur ${user.prenom} sera bloqué.);
// }

// // Fonction pour simuler la navigation dans la pagination
// goToPage(pageNumber: number): void {
// // console.log(Navigation vers la page : ${pageNumber});
// // Ici, vous implémenteriez la logique de mise à jour des données du tableau
// }

// // État de la pagination (simulation)
// currentPage: number = 1;
// valeurs de stats (exemple)
  total = 2031;
  recruteurs = 438;
  prestataires = 1280

}
