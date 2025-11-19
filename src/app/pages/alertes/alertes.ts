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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Env } from '../../env';

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
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  private loadAlerts(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(Env.API_URL + 'signalements/admin', { headers })
      .subscribe({
        next: (res: any) => {
          const items = res || [];
          this.alerts = items.map((item: any) => ({
            id: item.id,
            title: item.missionTitre || 'Mission signalée',
            description:
              item.description ||
              item.motif ||
              'Mission signalée par un utilisateur.',
            isSeen: false,
            advertisementId: item.missionId || 0,
            missionTitle: item.missionTitre,
            jeuneNom: item.jeuneNom,
            jeunePrenom: item.jeunePrenom,
            dateCreation: item.dateCreation,
          }));
        },
        error: (err) => {
          console.log(err);
        },
      });
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
      const confirmationData: ConfirmationDialogData = {
        title: 'Confirmer l\'envoi',
        message: `Êtes-vous sûr de vouloir envoyer cette notification aux ${
          notificationData.target === 'both'
            ? 'jeunes et recruteurs'
            : notificationData.target === 'youngs'
            ? 'jeunes'
            : 'recruteurs'
        } ?`,
      };

      const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: confirmationData,
      });

      confirmRef.afterClosed().subscribe((confirmResult) => {
        if (confirmResult === true) {
          const cible = notificationData.target === 'both'
            ? 'TOUS'
            : notificationData.target === 'youngs'
              ? 'JEUNES'
              : 'RECRUTEURS';

          const body = {
            titre: notificationData.title,
            message: notificationData.message,
            cible: cible,
          };

          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          });

          this.http
            .post<any>(Env.API_URL + 'notifications/admin/broadcast', body, { headers })
            .subscribe({
              next: () => {
                this.snackBar.open(
                  `Notification envoyée aux ${notificationData.target === 'both' ? 'jeunes et recruteurs' : notificationData.target === 'youngs' ? 'jeunes' : 'recruteurs'} !`,
                  'Fermer',
                  { duration: 5000, panelClass: ['snackbar-success'] }
                );
              },
              error: () => {
                this.snackBar.open(
                  `Erreur lors de l'envoi de la notification`,
                  'Fermer',
                  { duration: 5000 }
                );
              },
            });
        } else {
          this.snackBar.open('Envoi de notification annulé.', 'Fermer', { duration: 2000 });
        }
      });

    } else {
      // Cas : ANNULER (result est null)
      this.snackBar.open('Envoi de notification annulé.', 'Fermer', { duration: 2000 });
    }
  });
  }
}
