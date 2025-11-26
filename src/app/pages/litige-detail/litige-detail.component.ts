import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { Data } from '../../services/data';
import { Env } from '../../env';

@Component({
  selector: 'app-litige-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ModalComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './litige-detail.component.html',
  styleUrls: ['./litige-detail.component.css']
})
export class LitigesDetailComponent implements OnInit {
  litigeId: string | null = null;
  litige: any = null;

  @ViewChild('successModal') successModal!: ModalComponent;

  // CORRIGÉ: Ajout du type 'envoyer'
  pendingAction: 'fermer' | 'resoudre' | 'envoyer' | null = null;
  confirmationMessage: string = '';

  // PROPRIÉTÉS ADMIN
  adminCommentaire: string = '';
  communicationType: 'interne' | 'jeune' | 'recruteur' = 'interne';
  ajusterNote: boolean = false;
  actionFinanciere: boolean = false;
  avatarUrl1= 'images/hommepro.png'
  avatarUrl2='images/profil.png'

  constructor(private route: ActivatedRoute, private router: Router,private data:Data) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('no');
      if (id) {
        this.litigeId = id;
        this.loadLitigeDetails(Number(id));
      } else {
        this.router.navigate(['/litiges']);
      }
    });
  }

  loadLitigeDetails(id: number): void {
    // const numericId = parseInt(id, 10);
    // let statutLitige = 'En attente';

    // if (numericId === 1) { statutLitige = 'En Cours'; }
    // else if (numericId === 2) { statutLitige = 'Ouvert'; }
    // else if (numericId === 3) { statutLitige = 'RESOLU'; }
    // else if (numericId === 4) { statutLitige = 'FERME'; }
    // else if (numericId === 5 || numericId === 6 || numericId === 7) { statutLitige = 'En Cours'; }
    // else { statutLitige = 'En attente'; }

    // this.litige = {
    //   numero: id,
    //   objet: 'Livraison',
    //   descriptionCourte: "Le jeune n'a pas été payé pour la mission effectuée.",
    //   descriptionComplete: "Le jeune n'a pas reçu son paiement de 15.000 FCFA pour la livraison effectuée le 08/01/2025. Le recruteur ne répond pas aux messages depuis 48h. Le jeune a joint des captures d'écran de l'accord et des rappels de paiement.",
    //   statut: statutLitige,
    //   montant: '15.000 FCFA',
    //   dateCreation: '10/01/2025',
    //   derniereMiseAJour: '10/01/2025',
    //   resolutionPrevued: '22/01/2025',
    //   jeune: { nom: 'Ramatou Konare', email: 'rama@gmail.com', avatarUrl: 'images/hommepro.png' },
    //   recruteur: { nom: 'Amadou Bakagoyo', email: 'amadou@gmail.com', avatarUrl: 'images/profil.png' },
    //   missionAssociee: { numero: id, titre: 'Livraison' },
    //   documentsJoints: [
    //     { nom: 'Capture_accord.png', url: '/docs/1/accord.png' },
    //     { nom: 'Preuve_rappel.pdf', url: '/docs/1/rappel.pdf' },
    //   ],
    //   journalActivite: [
    //     { date: '10/01/2025 à 09:30', type: 'statut', texte: "Litige créé avec le statut 'Ouvert'." },
    //     { date: '10/01/2025 à 11:00', type: 'statut', texte: "Statut mis à jour à 'En Cours' par Admin N°001." },
    //     { date: '10/01/2025 à 14:20', type: 'note', texte: "Analyse initiale: le jeune a fourni des preuves solides." }
    //   ]
    // };

    this.data.getDataById(Env.LITIGE+'/',id).subscribe({
      next:(value:any)=> {
        console.log(value);
        this.litige = value[0];

        // Normaliser les URLs des photos si elles existent
        if (this.litige.jeunePrestateurPhotoUrl) {
            this.litige.jeunePrestateurPhotoUrl = this.normalizePhotoUrl(this.litige.jeunePrestateurPhotoUrl);
        }
        if (this.litige.recruteurPhotoUrl) {
            this.litige.recruteurPhotoUrl = this.normalizePhotoUrl(this.litige.recruteurPhotoUrl);
        }
        if (this.litige.documentUrl) {
            this.litige.documentUrl = this.normalizePhotoUrl(this.litige.documentUrl);
        }

        // Initialiser journalActivite s'il n'existe pas
        if (!this.litige.journalActivite) {
            this.litige.journalActivite = [];
        }
      },
      error(err) {
        console.log(err);
      },
    })

  }

  normalizePhotoUrl(rawPath: string): string {
    if (!rawPath) return '';
    const uploadIndex = rawPath.toLowerCase().indexOf('uploads');
    const relativePath = uploadIndex >= 0 ? rawPath.substring(uploadIndex) : rawPath;
    const normalized = relativePath.replace(/\\/g, '/');
    const baseUrl = 'http://localhost:8080/';
    return baseUrl + normalized;
  }

  // MÉTHODE AJOUTÉE/CORRIGÉE
  get isLitigeClosed(): boolean {
    if (!this.litige) return true;
    const status = this.litige.statut;
    return status === 'RESOLU' || status === 'FERME';
  }

  // MÉTHODE AJOUTÉE/CORRIGÉE
  logActivity(type: 'statut' | 'note' | 'message', texte: string): void {
    const now = new Date();
    const dateString = `${now.toLocaleDateString()} à ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newLog = {
      date: dateString,
      type: type,
      texte: texte
    };

    if (!this.litige.journalActivite) {
        this.litige.journalActivite = [];
    }
    this.litige.journalActivite.unshift(newLog);
  }

  onStatusChange(): void {
    // Tous les changements de statut sont appliqués directement
    this.logActivity('statut', `Statut mis à jour à '${this.litige.statut}'`);
  }



  envoyerCommunication(): void {
    if (this.isLitigeClosed || !this.adminCommentaire) return;

    let logText = '';
    let logType: 'note' | 'message' | 'statut' = 'note';
    let destinataireNom = '';
    let apiDestinataire: 'JEUNE' | 'RECRUTEUR' | null = null;

    switch (this.communicationType) {
      case 'interne':
        logText = `NOTE INTERNE (Admin): ${this.adminCommentaire}`;
        logType = 'note';
        // Pour les notes internes, on garde la logique locale ou un autre endpoint si existant
        // Ici on suppose que c'est juste local pour l'instant ou géré différemment
        this.logActivity(logType, logText);
        this.adminCommentaire = '';
        return; // On arrête ici pour la note interne pour l'instant
      case 'jeune':
        logText = `MESSAGE ENVOYÉ au JEUNE: ${this.adminCommentaire}`;
        logType = 'message';
        destinataireNom = this.litige.jeunePrestateurNom;
        apiDestinataire = 'JEUNE';
        break;
      case 'recruteur':
        logText = `MESSAGE ENVOYÉ au RECRUTEUR: ${this.adminCommentaire}`;
        logType = 'message';
        destinataireNom = this.litige.recruteurNom;
        apiDestinataire = 'RECRUTEUR';
        break;
    }

    if (apiDestinataire) {
        const payload = {
            destinataire: apiDestinataire,
            contenu: this.adminCommentaire
        };

        console.log('Envoi du message...', payload);
        this.data.postData(`${Env.LITIGE}/${this.litigeId}/messages-admin`, payload).subscribe({
            next: (res: any) => {
                console.log('Message envoyé avec succès', res);
                // On n'ajoute PAS le message au journal d'activité interne (demande utilisateur)
                this.adminCommentaire = '';
                this.successModal.message = `Message envoyé à ${destinataireNom} avec succès.`;
                this.successModal.open();
            },
            error: (err: any) => {
                console.error('Erreur lors de l\'envoi du message', err);
                alert("Erreur lors de l'envoi du message. Veuillez vérifier la console.");
            }
        });
    } else {
        console.warn('Aucun destinataire API défini');
    }
  }

  telechargerDocument(url: string): void {
    console.log(`Téléchargement du document à l'URL: ${url}`);
    window.open(url, '_blank');
  }

  fermerLitige(): void {
    if (this.isLitigeClosed) return;
    if (confirm('Voulez-vous vraiment FERMER ce litige ? Cette action pourrait être irréversible.')) {
      this.litige.statut = 'FERME';
      this.logActivity('statut', "Litige FERME par l'administrateur.");
      this.successModal.message = "Litige FERME avec succès.";
      this.successModal.open();
      this.ajusterNote = false;
      this.actionFinanciere = false;
    }
  }

  resoudreLitige(): void {
    if (this.isLitigeClosed) return;
    const message = `Êtes-vous sûr(e) de vouloir RÉSOUDRE ce litige ?\n\n- Ajustement de note: ${this.ajusterNote ? 'Oui' : 'Non'}\n- Action financière: ${this.actionFinanciere ? 'Oui' : 'Non'}`;
    if (confirm(message)) {
      this.litige.statut = 'RESOLU';
      this.logActivity('statut', `Litige RÉSOUDRE. Note ajustée: ${this.ajusterNote ? 'Oui' : 'Non'}. Action financière: ${this.actionFinanciere ? 'Oui' : 'Non'}.`);
      this.successModal.message = "Litige RESOLU avec succès !";
      this.successModal.open();
      this.ajusterNote = false;
      this.actionFinanciere = false;
    }
  }



  goBack(): void {
    this.router.navigate(['/litiges']);
  }
}
