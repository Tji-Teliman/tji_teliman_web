import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';


export interface Payment {
  missionTitle: string;
  recruiter: string;
  contractor: string;
  remuneration: string;
  paymentStatus: 'Réussi' | 'En attente' | 'Échoué';
  paymentDate: string;
}

@Component({
  selector: 'app-paiements',
  imports: [CommonModule, FormsModule , AdminHeaderComponent],
  standalone: true,
  templateUrl: './paiements.html',
  styleUrl: './paiements.css',
})
export class Paiements {

  // Propriétés des cartes (inchangées)
  totalPaymentsEffected = 850;
  pendingPayments = 420;
  failedPayments = 310;
  validatedPaymentsThisMonth = 95;

  // Variable liée à la barre de recherche ([(ngModel)]="searchQuery")
  searchQuery: string = '';

  // Liste complète des données (la source)
  paymentsList: Payment[] = [
    // Vos données (la liste est la même que dans la réponse précédente)
    { missionTitle: 'Aide Menagere', recruiter: 'Moussa Cisse', contractor: 'Mohamed Traoré', remuneration: '15.000 FCFA', paymentStatus: 'Réussi', paymentDate: '10/01/2025' },
    { missionTitle: 'Jardinage', recruiter: 'Mme Jeanne', contractor: 'Koffi Paul', remuneration: '10.000 FCFA', paymentStatus: 'En attente', paymentDate: '11/01/2025' },
    { missionTitle: 'Livraison express', recruiter: 'Ali Traoré', contractor: 'Saliou Diallo', remuneration: '5.000 FCFA', paymentStatus: 'Réussi', paymentDate: '12/01/2025' },
    { missionTitle: 'Plomberie simple', recruiter: 'Moussa Cisse', contractor: 'Mohamed Traoré', remuneration: '20.000 FCFA', paymentStatus: 'Réussi', paymentDate: '13/01/2025' },
    { missionTitle: 'Cours de Maths', recruiter: 'Université', contractor: 'Aicha Diallo', remuneration: '50.000 FCFA', paymentStatus: 'En attente', paymentDate: '14/01/2025' },
    { missionTitle: 'Aide Menagere', recruiter: 'Fatou Diop', contractor: 'Mohamed Traoré', remuneration: '15.000 FCFA', paymentStatus: 'Réussi', paymentDate: '15/01/2025' },
    // Ajoutez plus de données pour tester le filtre
  ];


  /**
   * Logique de filtrage : retourne la liste des paiements filtrés.
   * Cette méthode est appelée par le *ngFor dans le template.
   */
  get filteredPaymentsList(): Payment[] {
    // Si le champ de recherche est vide, on affiche la liste complète
    if (!this.searchQuery) {
      return this.paymentsList;
    }

    const searchLower = this.searchQuery.toLowerCase();

    return this.paymentsList.filter(payment => {
      // Filtrage basé sur le Titre, le Statut ou la Rémunération
      return payment.missionTitle.toLowerCase().includes(searchLower) ||
             payment.paymentStatus.toLowerCase().includes(searchLower) ||
             payment.remuneration.toLowerCase().includes(searchLower);
    });
  }

  /**
   * Fonction pour simuler la recherche au clic du bouton "Rechercher".
   * (Peut être laissée vide si le filtrage se fait automatiquement via le getter)
   */
  searchPayments(): void {
    // Comme nous utilisons un getter, le template se mettra à jour automatiquement
    // dès que `this.searchQuery` change (via ngModel), donc cette fonction est optionnelle.
    console.log(`Recherche lancée pour : ${this.searchQuery}`);
  }
}