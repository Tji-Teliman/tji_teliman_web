import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-notification-dialog',
  standalone: true, // CLÉ : Composant Standalone
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './send-notification-dialog.component.html',
  styleUrls: ['./send-notification-dialog.component.css']
})
export class SendNotificationDialogComponent implements OnInit {
  
  notificationForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SendNotificationDialogComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      target: [[], Validators.required], 
      title: ['', [Validators.required, Validators.maxLength(50)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      linkUrl: ['', Validators.pattern('^(http|https)://.*$|^/.*$')] 
    });
  }

  sendNotification(): void {
    if (this.notificationForm.valid) {
      const payload = this.notificationForm.value;
      
      console.log('Envoi des données:', payload);

      // Simulation de l'envoi
      setTimeout(() => {
        this.snackBar.open(' Notification en cours d\'envoi!', 'Fermer', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        
        this.dialogRef.close(true); 
      }, 1500);
    } else {
      this.notificationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
