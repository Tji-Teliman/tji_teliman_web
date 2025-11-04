import { Component,Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    // Permet d'injecter des données dans le modal (le message de confirmation)
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  // Ferme le modal en retournant 'true' (Confirmation)
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  // Ferme le modal en retournant 'false' (Annulation/Ignorer)
  onCancel(): void {
    this.dialogRef.close(false);
  }
}

