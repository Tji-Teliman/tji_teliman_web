import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour *ngIf / [ngClass]
import { MatCardModule } from '@angular/material/card'; // Pour les cartes Material
import { MatButtonModule } from '@angular/material/button'; // Pour les boutons Material
import { MatIconModule } from '@angular/material/icon'; // Pour les icônes (work, arrow_back)
import { ActivatedRoute, Router } from '@angular/router'; // Pour la navigation
import { ModalComponent } from '../../components/modal/modal.component'; // Ajustez ce chemin si nécessaire

@Component({
  selector: 'app-litige-detail',
  standalone: true,
  // Ajout des modules Material + CommonModule + ModalComponent
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, ModalComponent],
  templateUrl: './litige-detail.component.html',
  styleUrls: ['./litige-detail.component.css']
})
export class LitigesDetailComponent implements OnInit { 
  litigeId: string | null = null;
  litige: any = null; 
  
  // 1. Références aux modals de confirmation
  @ViewChild('actionConfirmationModal') actionConfirmationModal!: ModalComponent;
  @ViewChild('successModal') successModal!: ModalComponent; 
  
  // 2. Propriétés pour stocker l'état et le message du modal
  pendingAction: 'fermer' | 'resoudre' | null = null;
  confirmationMessage: string = '';

  // Injectez ActivatedRoute et Router pour la navigation
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('no'); 
      if (id) {
        this.litigeId = id;
        this.loadLitigeDetails(this.litigeId);
      } else {
        this.router.navigate(['/litiges']); 
      }
    });
  }

  loadLitigeDetails(id: string): void {
    // CORRECTION 2: Logique pour simuler un statut variable basé sur l'ID numérique
    const numericId = parseInt(id, 10); // Conversion en nombre
    let statutLitige = 'En attente'; 

    if (numericId === 1) {
        statutLitige = 'Résolu'; 
    } else if (numericId === 2) {
        statutLitige = 'Ouvert'; 
    } else if (numericId === 3) {
        statutLitige = 'Résolu';
    } else if (numericId === 4) {
        statutLitige = 'Fermé';
    } else if (numericId === 5 || numericId === 6 || numericId === 7) {
        statutLitige = 'En Cours';
    } else {
        statutLitige = 'En attente';
    }

    // Simuler le chargement des données
    this.litige = {
      numero: id, 
      objet: 'Livraison',
      description: "Le jeune n'a pas été payé pour la mission effectuée.",
      statut: statutLitige, // Utilisation du statut variable
      montant: '15.000 FCFA',
      dateCreation: '10/01/2025',
      derniereMiseAJour: '10/01/2025',
      resolutionPrevued: '22/01/2025',
      jeune: {
        nom: 'Ramatou Konare',
        email: 'rama@gmail.com',
        avatarUrl: 'images/hommepro.png' 
      },
      recruteur: {
        nom: 'Amadou Bakagoyo',
        email: 'amadou@gmail.com',
        avatarUrl: 'images/profil.png' 
      },
      missionAssociee: {
        numero: id,
        titre: 'Livraison'
      }
    };
  }

  // ⭐ NOUVEAU GETTER : Détermine si le litige est dans un état final.
  get isLitigeClosed(): boolean {
    if (!this.litige) return true; // Empêche les actions si les données ne sont pas chargées
    const status = this.litige.statut;
    // Les statuts considérés comme "finaux" sont "Résolu" et "Fermé".
    return status === 'Résolu' || status === 'Fermé';
  }

  // --- LOGIQUE DE GESTION DES ACTIONS AVEC CONFIRMATION ---

  fermerLitige(): void {
    // ⭐ AJOUT : Blocage si déjà dans un état final
    if (this.isLitigeClosed) return; 
    
    this.pendingAction = 'fermer';
    this.confirmationMessage = 'Voulez-vous vraiment FERMER ce litige ? Cette action pourrait être irréversible.';
    this.actionConfirmationModal.open();
  }

  resoudreLitige(): void {
    // ⭐ AJOUT : Blocage si déjà dans un état final
    if (this.isLitigeClosed) return; 
    
    this.pendingAction = 'resoudre';
    this.confirmationMessage = 'Êtes-vous sûr(e) de vouloir RÉSOUDRE ce litige ? Ceci marquera le litige comme terminé.';
    this.actionConfirmationModal.open();
  }

  confirmAction(): void {
    this.actionConfirmationModal.close();
    
    // Logique d'action et d'affichage de succès
    // ... (le reste de la logique reste inchangé) ...

    if (this.pendingAction === 'resoudre') {
      console.log('Action: Résolution confirmée pour le litige ID:', this.litigeId);
      // Simuler la mise à jour du statut
      this.litige.statut = 'Résolu';
      this.successModal.message = "Litige résolu avec succès !";
    } else if (this.pendingAction === 'fermer') {
      console.log('Action: Fermeture confirmée pour le litige ID:', this.litigeId);
      // Simuler la mise à jour du statut
      this.litige.statut = 'Fermé';
      this.successModal.message = "Litige fermé avec succès.";
    }
    
    // 3. Afficher le message de succès (on ne redirige plus pour voir le statut changer)
    if (this.pendingAction) {
        this.successModal.open();
        // setTimeout(() => this.router.navigate(['/litiges']), 2000); // 🚫 Suppression de la redirection pour permettre de voir le statut mis à jour
    }
    
    // 4. Réinitialiser
    this.pendingAction = null;
  }

  goBack(): void {
    this.router.navigate(['/litiges']); 
  }
}