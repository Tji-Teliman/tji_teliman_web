import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { Data } from '../../services/data';
import { Env } from '../../env';


export interface Payment {
recruteurPrenom: any;
recruteurNom: any;
jeunePrestateurPrenom: any;
jeunePrestateurNom: any;
missionRemuneration: any;
statutPaiement: any;
datePaiement: any;
missionTitre: any;
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
  totalPaymentsEffected = 0;
  pendingPayments = 0;
  failedPayments = 0;
  validatedPaymentsThisMonth = 0;

  searchQuery: string = '';

  // Liste complète des données (la source)
  paymentsList: Payment[] = [];

  constructor(private data:Data){}

  ngOnInit(): void {
    this.data.getData(Env.PAIEMENT+'/all').subscribe({
      next:(value:any) =>{
        console.log(value);
        this.paymentsList = value;
        this.calculateStats();
      },
      error(err) {
        console.log(err);
      },
    })

  }

  calculateStats(): void {
    // Total paiements réussis
    this.totalPaymentsEffected = this.paymentsList
      .filter(p => p.statutPaiement?.toLowerCase() === 'reussie')
      .length;

    // Paiements en attente
    this.pendingPayments = this.paymentsList
      .filter(p => p.statutPaiement?.toLowerCase() === 'en_attente')
      .length;

    // Paiements échoués
    this.failedPayments = this.paymentsList
      .filter(p => p.statutPaiement?.toLowerCase() === 'echec')
      .length;

    // Paiements validés pour le mois en cours
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.validatedPaymentsThisMonth = this.paymentsList.filter(p => {
      const datePaiement = new Date(p.datePaiement);
      return (
        p.statutPaiement?.toLowerCase() === 'reussie' &&
        datePaiement.getMonth() === currentMonth &&
        datePaiement.getFullYear() === currentYear
      );
    }).length;
  }


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

  searchPayments(): void {
    console.log(`Recherche lancée pour : ${this.searchQuery}`);
  }
}
