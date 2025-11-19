import { Component , ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngFor, *ngIf, [ngClass]
import { FormsModule } from '@angular/forms'; // Nécessaire pour [(ngModel)]
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ModalComponent } from '../../components/modal/modal.component'; // ⬅IMPORT NÉCESSAIRE
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Env } from '../../env';
// Interface pour définir la structure d'une compétence (bonne pratique TypeScript)
interface Skill {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive'; // Statut précis
  iconClass: string; // Pour l'icône Font Awesome
  iconColorClass: string; // Pour la couleur de fond de l'icône
}

// Interface pour le modèle du formulaire (Ajout Rapide)
interface QuickAddForm {
  name: string;
  level: string;
  description: string;
  isActive: boolean;
}

@Component({
  // Le sélecteur doit être 'app-root' pour que l'application démarre dans cet environnement
  selector: 'app-root',
  // IMPORTANT : Ajout des modules nécessaires (CommonModule, FormsModule)
  imports: [CommonModule, FormsModule ,AdminHeaderComponent,ModalComponent ],
  // Le TEMPLATE est intégré directement (remplace templateUrl: './competences.html')
  template: `
    <!-- Note : La librairie Font Awesome est chargée via le CSS ci-dessous -->
         <div class="barre"><app-admin-header></app-admin-header></div>
    <div class="main-content">

        <!-- Colonne de gauche: Liste des Compétences -->
        <div class="skills-list-section card">
            <h2>Liste des Compétences</h2>

            <div class="table-header">
                <span class="col-name">Nom</span>
                <span class="col-status">Statut</span>
                <span class="col-actions">Actions</span>
            </div>

            <!-- Affichage des compétences -->
            <div class="skill-item"
                 *ngFor="let skill of skills; let i = index"
                 [class.inactive-row]="skill.status === 'Inactive'">

                <!-- Colonne Nom -->
                <span class="col-name">
                    <!-- Utilisation des classes d'icônes -->
                    <i class="fas {{ skill.iconClass }} {{ skill.iconColorClass }}"></i>
                    <div class="text-content">
                        <strong>{{ skill.name }}</strong>
                        <small>{{ skill.description }}</small>
                    </div>
                </span>

                <!-- Statut avec classes dynamiques -->
                <span class="col-status" [ngClass]="skill.status === 'Active' ? 'active' : 'inactive'">
                    {{ skill.status }}
                </span>

                <!-- Actions -->
                <span class="col-actions">
                    <i class="fas fa-pencil-alt icon-action"
                       (click)="editSkill(i)"></i>

                    <i class="fas fa-trash-alt icon-action red"
                       (click)="deleteSkill(i)"></i>

                    <i class="fas fa-toggle-{{ skill.status === 'Active' ? 'on' : 'off' }} icon-action"
                       (click)="toggleStatus(i)"></i>
                </span>
            </div>

        </div>

        <!-- Colonne de droite: Ajout Rapide -->
        <div class="quick-add-section card">
            <h3>Ajout Rapide</h3>

            <form (ngSubmit)="addSkill()">
                <div class="form-group">
                    <label for="skill-name">Nom de la compétence</label>
                    <input type="text" id="skill-name" placeholder="Ex: Photographie" [(ngModel)]="quickAddForm.name" name="skillName" required>
                </div>

                <div class="form-group">
                    <label for="skill-level">Niveau</label>
                    <select id="skill-level" [(ngModel)]="quickAddForm.level" name="skillLevel">
                        <option *ngFor="let level of levelOptions" [value]="level">{{ level }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="skill-description">Description</label>
                    <textarea id="skill-description" placeholder="Description de la compétence" [(ngModel)]="quickAddForm.description" name="skillDescription"></textarea>
                </div>

                <div class="form-checkbox">
                    <input type="checkbox" id="competence-active" [(ngModel)]="quickAddForm.isActive" name="skillActive">
                    <label for="competence-active">Compétence active</label>
                </div>

                <button class="add-skill-button" type="submit">
                    <i class="fas fa-plus"></i>
                    Ajouter la compétence
                </button>
            </form>
        </div>
    </div>

    <app-modal
      #deleteModal
      type="confirmation"
      message="Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible."
      confirmText="Confirmer la suppression"
      cancelText="Annuler"
      (confirmed)="confirmDeletion()"
      (dismissed)="skillToDeleteIndex = null"
    ></app-modal>

    <app-modal
      #successModal
      type="success"
      message="Compétence supprimée avec succès."
      [width]="350"
    ></app-modal>

  `,
  // Les STYLES sont intégrés directement (remplace styleUrl: './competences.css')
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    :host {
        display: block;
        padding: 20px;
        background-color: White;
        font-family: 'Inter', sans-serif;
    }

    .main-content {
        display: grid;
        grid-template-columns: 2fr 1fr; /* 2/3 pour la liste, 1/3 pour l'ajout */
        gap: 20px;
        max-width: 1400px;
        margin: 0 auto;
        margin-top: 2%;
    }

    .card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        padding: 30px;
    }

    h2, h3 {
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 20px;
    }

    /* --- LISTE DES COMPÉTENCES --- */

    .skills-list-section {
        display: flex;
        flex-direction: column;
    }

    .table-header, .skill-item {
        display: grid;
        grid-template-columns: 3fr 1.5fr 1fr 0.5fr;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #edf2f7;
        font-size: 14px;
    }

    .table-header {
        font-weight: 600;
        color: #4a5568;
        padding-bottom: 15px;
        border-bottom: 2px solid #e2e8f0;
        margin-bottom: 5px;
    }

    .skill-item {
        transition: background-color 0.2s;
    }

    .skill-item:hover {
        background-color: #f7fafc;
    }

    .inactive-row {
        opacity: 0.6;
    }

    /* Colonnes */
    .col-name {
        display: flex;
        align-items: center;
        font-weight: 600;
    }

    .col-name i {
        font-size: 16px;
        width: 36px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 8px;
        margin-right: 15px;
        color: #ffffff;
    }

    .text-content {
        display: flex;
        flex-direction: column;
    }

    .text-content small {
        font-weight: 400;
        color: #718096;
        margin-top: 2px;
    }

    .col-status {
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 6px;
        text-align: center;
        width: fit-content;
    }

    .active {
        background-color: #c6f6d5; /* Vert très clair */
        color: #276749; /* Vert foncé */
    }

    .inactive {
        background-color: #fed7d7; /* Rouge très clair */
        color: #9b2c2c; /* Rouge foncé */
    }

    .col-actions {
        display: flex;
        gap: 15px;
    }

    .icon-action {
        cursor: pointer;
        color: #a0aec0;
        transition: color 0.2s;
    }

    .icon-action:hover {
        color: #2b6cb0; /* Bleu pour l'édition */
    }

    .icon-action.red:hover {
        color: #e53e3e; /* Rouge pour la suppression */
    }

    /* Couleurs d'icônes personnalisées */
    .icon-delivery { background-color: #4299e1; } /* Bleu */
    .icon-math { background-color: #f6ad55; } /* Orange */
    .icon-cleaning { background-color: #38b2ac; } /* Teal */
    .icon-design { background-color: #e53e3e; } /* Rouge */
    .icon-electric { background-color: #ecc94b; } /* Jaune */
    .icon-event, .icon-default { background-color: #6b46c1; } /* Violet */


    /* --- FORMULAIRE AJOUT RAPIDE --- */

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 5px;
    }

    input[type="text"], select, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-sizing: border-box;
        font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    input[type="text"]:focus, select:focus, textarea:focus {
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        outline: none;
    }

    textarea {
        resize: vertical;
        min-height: 80px;
    }

    .form-checkbox {
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 25px;
    }

    .form-checkbox input[type="checkbox"] {
        width: 16px;
        height: 16px;
        margin-right: 10px;
        cursor: pointer;
    }

    .form-checkbox label {
        margin-bottom: 0;
        font-weight: 400;
        cursor: pointer;
    }

    .add-skill-button {
        width: 100%;
        background-color: #48bb78; /* Vert */
        color: white;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
        box-shadow: 0 4px 6px rgba(72, 187, 120, 0.4);
    }

    .add-skill-button:hover {
        background-color: #38a169;
    }

    .add-skill-button i {
        margin-right: 8px;
    }

    /* RESPONSIVENESS */
    @media (max-width: 1024px) {
        .main-content {
            grid-template-columns: 1fr;
        }
    }
    @media (max-width: 768px) {
        .table-header, .skill-item {
            grid-template-columns: 2fr 1fr 1fr; /* Simplifier les colonnes pour mobile */
        }
        .table-header .col-actions, .skill-item .col-actions {
            display: none; /* Masquer les actions pour économiser de l'espace */
        }
    }
  `]
})
// La classe doit rester 'App' pour le démarrage de l'application
export class CompetencesComponent implements OnInit {

  // 1. Déclarer les références aux modals
  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('successModal') successModal!: ModalComponent;

  constructor(private http: HttpClient) {}

  // 2. Variable pour stocker l'index de la compétence à supprimer
  skillToDeleteIndex: number | null = null;
  skillToEditIndex: number | null = null;
  /** Liste des compétences affichées dans le tableau. */
  public skills: Skill[] = [];

  /** Modèle de données pour le formulaire d'Ajout Rapide. */
  public quickAddForm: QuickAddForm = {
    name: '',
    level: 'Débutant',     // Valeur par défaut
    description: '',
    isActive: true
  };

  /** Liste des options pour les sélecteurs du formulaire */
  public levelOptions: string[] = ['Débutant', 'Intermédiaire', 'Expert'];

  // 4 icônes de compétences utilisées en rotation
  private skillIcons = [
    { iconClass: 'fa-tools', iconColorClass: 'icon-electric' },      // Technique / bricolage
    { iconClass: 'fa-book', iconColorClass: 'icon-math' },           // Connaissances / enseignement
    { iconClass: 'fa-code', iconColorClass: 'icon-default' },        // Informatique
    { iconClass: 'fa-paint-brush', iconColorClass: 'icon-design' },  // Créatif
  ];

  ngOnInit(): void {
    this.loadCompetences();
  }

  private loadCompetences(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(Env.ADMIN + 'competences', { headers }).subscribe({
      next: (res: any) => {
        const items = res || [];
        this.skills = items.map((item: any, index: number) => {
          const icon = this.skillIcons[index % this.skillIcons.length];
          return {
            id: item.id,
            name: item.nom,
            description: item.description,
            status: 'Active',
            iconClass: icon.iconClass,
            iconColorClass: icon.iconColorClass,
          };
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  // --- LOGIQUE DU FORMULAIRE ---

  /**
   * Méthode appelée lorsque l'utilisateur clique sur "Ajouter la compétence".
   */
  public addSkill(): void {
    // Gestion d'erreur (affiche un message dans la console si le nom est manquant)
    if (!this.quickAddForm.name) {
      console.error('Erreur: Le nom est obligatoire.');
      return;
    }

    const body = {
      nom: this.quickAddForm.name,
      description: this.quickAddForm.description
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Mode édition
    if (this.skillToEditIndex !== null) {
      const skill = this.skills[this.skillToEditIndex];

      this.http.put<any>(`${Env.ADMIN}competences/${skill.id}`, body, { headers }).subscribe({
        next: (res: any) => {
          const item = res.data;
          this.skills[this.skillToEditIndex!] = {
            ...skill,
            id: item.id,
            name: item.nom,
            description: item.description,
          };
          this.resetForm();
        },
        error: (err) => console.log(err),
      });

    } else {
      // Création
      this.http.post<any>(Env.ADMIN + 'competences', body, { headers }).subscribe({
        next: (res: any) => {
          const item = res.data;
          const icon = this.skillIcons[this.skills.length % this.skillIcons.length];
          const newSkill: Skill = {
            id: item.id,
            name: item.nom,
            description: item.description,
            status: this.quickAddForm.isActive ? 'Active' : 'Inactive',
            iconClass: icon.iconClass,
            iconColorClass: icon.iconColorClass,
          };
          this.skills.push(newSkill);
          this.resetForm();
        },
        error: (err) => console.log(err),
      });
    }
  }

  private resetForm(): void {
    this.quickAddForm = {
      name: '',
      level: this.levelOptions[0],
      description: '',
      isActive: true
    };
    this.skillToEditIndex = null;
  }

  // --- LOGIQUE DES ACTIONS DE LA LISTE ---

  /**
   * Supprime une compétence de la liste.
   * @param index L'index de la compétence dans le tableau 'skills'.
   */
  /**
   * Déclenche l'ouverture du modal de confirmation de suppression.
   * @param index L'index de la compétence dans le tableau 'skills'.
   */
  public deleteSkill(index: number): void {
    this.skillToDeleteIndex = index; // Stocke l'index
    this.deleteModal.open();         // Ouvre le modal
  }

  /**
   * Exécute la suppression après confirmation par le modal.
   */
  public confirmDeletion(): void {
    if (this.skillToDeleteIndex === null || this.skillToDeleteIndex < 0) return;
    const skill = this.skills[this.skillToDeleteIndex];

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete<any>(`${Env.ADMIN}competences/${skill.id}`, { headers }).subscribe({
      next: () => {
        this.skills.splice(this.skillToDeleteIndex!, 1);
        this.successModal.open();
        this.skillToDeleteIndex = null;
      },
      error: (err) => console.log(err),
    });
  }

  /**
   * Prépare l'édition d'une compétence.
   * @param index L'index de la compétence à modifier.
   */
  public editSkill(index: number): void {
    const skillToEdit = this.skills[index];

    this.skillToEditIndex = index;

    // Remplir le formulaire d'ajout rapide pour la modification
    this.quickAddForm = {
        name: skillToEdit.name,
        level: 'Débutant', // Valeur par défaut (à adapter si un niveau était sauvegardé)
        description: skillToEdit.description,
        isActive: skillToEdit.status === 'Active'
    };

    console.log(`Le formulaire est pré-rempli pour éditer "${skillToEdit.name}"`);
  }

  /**
   * Bascule le statut d'une compétence entre Active et Inactive (local uniquement).
   */
  public toggleStatus(index: number): void {
    const current = this.skills[index];
    const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    this.skills[index] = { ...current, status: newStatus };
  }
}
