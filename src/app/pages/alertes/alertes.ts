import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Alert } from '../../models/alert.model';
import { SendNotificationDialogComponent } from '../../components/ui/send-notification-dialog/send-notification-dialog.component';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ConfirmationDialogComponent , ConfirmationDialogData} from '../../components/modal/confirmation-dialog/confirmation-dialog.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-alertes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    AdminHeaderComponent,
    ConfirmationDialogComponent,
    RouterModule
  ],
  templateUrl: './alertes.html',
  styleUrl: './alertes.css',
})
export class Alertes implements OnInit {

  alerts: Alert[] = [];
  searchTerm: string = '';

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // --- SIMULATION DES DONNÉES (Pour voir les alertes) ---
    this.alerts = [
      { id: 1, title: 'Annonce signalée', description: "L'annonce 'Assistant Marketing' a été signalée comme suspecte par un utilisateur.", isSeen: false, advertisementId: 101 },
      { id: 2, title: 'Annonce signalée', description: "L'annonce 'Développeur Web' a été signalée comme suspecte par un utilisateur.", isSeen: false, advertisementId: 102 },
      { id: 3, title: 'Annonce signalée', description: "L'annonce 'Community Manager' a été signalée comme suspecte par un utilisateur.", isSeen: false, advertisementId: 103 },
      { id: 4, title: 'Annonce signalée', description: "L'annonce 'Designer UI/UX' a été signalée comme suspecte par un utilisateur.", isSeen: true, advertisementId: 104 },
      { id: 5, title: 'Alerte Utilisateur', description: 'Signalement de contenu inapproprié dans un profil.', isSeen: false, advertisementId: 0 },
    ];
  }

  get filteredAlerts(): Alert[] {
    if (!this.searchTerm) {
      return this.alerts;
    }
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    return this.alerts.filter(alert =>
      alert.title.toLowerCase().includes(lowerCaseTerm) ||
      alert.description.toLowerCase().includes(lowerCaseTerm)
    );
  }

  markAsSeen(alert: Alert): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmation',
      message: `Êtes-vous sûr de vouloir marquer cette alerte comme traitée et ignorer le signalement ?`
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        alert.isSeen = true;
        this.snackBar.open('Alerte marquée comme ignorée/traitée.', 'OK', { duration: 3000 });
      } else {
        this.snackBar.open('Action annulée.', 'OK', { duration: 2000 });
      }
    });
  }

  // 🟢 LOGIQUE DE SUPPRESSION UNIQUE ET CORRIGÉE (pas de duplication)
  deleteAlert(id: number): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmer la Suppression',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement cette alerte ? Cette action est irréversible.'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Confirmer la suppression
        this.alerts = this.alerts.filter(a => a.id !== id);
        this.snackBar.open('Alerte supprimée.', 'OK', { duration: 3000 });
      } else {
        // Annuler
        this.snackBar.open('Suppression annulée.', 'OK', { duration: 2000 });
      }
    });
  }

  // 🟢 LOGIQUE DE REDIRECTION UNIQUE ET CORRIGÉE
  viewAdvertisement(advertisementId: number): void {
    if (advertisementId && advertisementId > 0) {
      // Pour éviter les conflits de routes, nous allons utiliser le chemin '/annonce-details'
      // Assurez-vous d'ajouter cette route dans votre fichier de routes (routes.ts)
      this.router.navigate(['/annonce-details', advertisementId]);

      this.snackBar.open(`Redirection vers l'annonce ID ${advertisementId}...`, 'OK', { duration: 2000 });
    } else {
      this.snackBar.open('Cette alerte ne renvoie pas à une annonce spécifique.', 'OK', { duration: 3000 });
    }
  }


  openSendNotificationDialog(): void {
  // Ouvre le dialogue avec les configurations définies
  const dialogRef = this.dialog.open(SendNotificationDialogComponent, {
    width: '500px',
    disableClose: true, // Empêche la fermeture par clic en dehors ou Échap
    panelClass: 'notification-dialog-panel',
  });

  // S'abonne à l'événement de fermeture du dialogue
  dialogRef.afterClosed().subscribe(result => {
    // Le 'result' sera soit 'null' (Annuler), soit 'NotificationData' (Envoyer)

    if (result) {
      // Cas : ENVOYER (result contient les données)
      const notificationData = result;

      // Ici, vous implémenteriez la logique d'envoi à votre backend/API.
      // Par exemple : this.notificationService.send(notificationData).subscribe(...);

      console.log('Notification à envoyer :', notificationData);

      // Afficher un message de succès après l'envoi simulé
      this.snackBar.open(
        `Notification envoyée aux ${notificationData.target === 'both' ? 'jeunes et recruteurs' : notificationData.target === 'youngs' ? 'jeunes' : 'recruteurs'} !`,
        'Fermer',
        { duration: 5000, panelClass: ['snackbar-success'] }
      );

    } else {
      // Cas : ANNULER (result est null)
      this.snackBar.open('Envoi de notification annulé.', 'Fermer', { duration: 2000 });
    }
  });
  }
}
