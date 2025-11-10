import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

// Interface pour structurer les données envoyées
export interface NotificationData {
  target: 'youngs' | 'recruiters' | 'both';
  title: string;
  message: string;
}

@Component({
  selector: 'app-send-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, // Pour les boutons stylisés
    MatInputModule,  // Pour les champs de texte
    MatSelectModule, // Pour le champ sélectif
  ],
  templateUrl: './send-notification-dialog.component.html',
  styleUrl: './send-notification-dialog.component.css',
})
export class SendNotificationDialogComponent implements OnInit {

  // Modèle de données pour le formulaire
  notification: NotificationData = {
    target: 'youngs', // Valeur par défaut
    title: '',
    message: '',
  };

  // Options pour le sélecteur
  targetOptions = [
    { value: 'youngs', viewValue: 'Jeunes' },
    { value: 'recruiters', viewValue: 'Recruteurs' },
    { value: 'both', viewValue: 'Les deux' },
  ];

  // Injection de MatDialogRef
  constructor(public dialogRef: MatDialogRef<SendNotificationDialogComponent>) {}

  ngOnInit(): void {}

  /**
   * Logique pour le bouton Annuler (Gris)
   * Ferme la modale et envoie `null` ou `false` pour indiquer l'annulation.
   */
  onCancel(): void {
    // La méthode close() de MatDialogRef ferme la modale.
    this.dialogRef.close(null);
  }

  /**
   * Logique pour le bouton Envoyer (Bleu)
   * Ferme la modale et envoie les données du formulaire.
   */
  onSend(): void {
    if (this.notification.title && this.notification.message) {
      // Ferme la modale et retourne les données du formulaire pour traitement
      this.dialogRef.close(this.notification);
    }
    // Note: Ajouter une logique de validation côté UI (désactiver le bouton ou message) si besoin
  }
}