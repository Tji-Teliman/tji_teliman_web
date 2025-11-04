// src/app/components/modal/modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  // Le template est défini ci-dessous pour inclure les styles
  template: `
    <div class="modal-backdrop" [class.visible]="isVisible">
      <div class="modal-content" [style.width.px]="width">
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
        </div>
        
        <div class="modal-footer" *ngIf="type === 'confirmation'">
          <button class="btn btn-confirm" (click)="confirm()">{{ confirmText }}</button>
          <button class="btn btn-cancel" (click)="cancel()">{{ cancelText }}</button>
        </div>
        
        <div class="modal-footer" *ngIf="type === 'success'">
          <button class="btn btn-ok" (click)="ok()">OK</button>
        </div>

      </div>
    </div>
  `,
  // Le style sera dans le fichier CSS ci-dessous
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() type: 'confirmation' | 'success' = 'confirmation'; // Type de modal
  @Input() message: string = '';
  @Input() confirmText: string = 'Confirmer';
  @Input() cancelText: string = 'Annuler';
  @Input() width: number = 420; // Largeur par défaut

  // Événements émis par le modal
  @Output() confirmed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();

  isVisible: boolean = false;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  // Actions
  confirm() {
    this.confirmed.emit();
    this.close();
  }

  cancel() {
    this.dismissed.emit();
    this.close();
  }
  
  ok() {
    this.dismissed.emit(); // Fermeture simple après succès
    this.close();
  }
}