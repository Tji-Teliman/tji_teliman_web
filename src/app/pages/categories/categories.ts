import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ModalComponent } from '../../components/modal/modal.component';

interface Category {
  id: number;
  name: string;
  description: string;
  photo: string; // Maintenant, il s'agira du nom du fichier ou d'un lien
  iconClass: string;
  iconColorClass: string;
  missions: number;
  active: boolean;
}

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule ,AdminHeaderComponent, ModalComponent],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class CategoriesComponent {

  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('successModal') successModal!: ModalComponent;

  categoryToDeleteId: number | null = null;
  categoryToEditId: number | null = null;

  // Données initiales
  categories = signal<Category[]>([
    { id: 1, name: 'Livraison', description: 'Transport de colis et courses', photo: 'camion.png', missions: 156, active: true, iconClass: 'fa-truck', iconColorClass: 'icon-delivery' },
    { id: 2, name: 'Enseignement', description: 'Cours particuliers et soutien scolaire', photo: 'prof.png', missions: 89, active: true, iconClass: 'fa-calculator', iconColorClass: 'icon-math' },
    { id: 3, name: 'Aide domestique', description: 'Ménage, cuisine, jardinage', photo: 'nettoyer.png', missions: 124, active: true, iconClass: 'fa-broom', iconColorClass: 'icon-cleaning' },
    { id: 4, name: 'Événementiel', description: 'Animation, DJ, organisation', photo: 'fete.png', missions: 45, active: false, iconClass: 'fa-music', iconColorClass: 'icon-event' },
    { id: 5, name: 'Manutention', description: 'Déménagement, manutention, aide aux tâches', photo: 'aide.png', missions: 124, active: true, iconClass: 'fa-wrench', iconColorClass: 'icon-default' },
  ]);

  // Définition d'icônes pour l'ajout rapide
  defaultIcon = {
    class: 'fa-tag',
    color: 'icon-default'
  };

  // formulaire (variables simples)
  newCategoryName = '';
  newCategoryDescription = '';
  newCategoryActive = true;

  // NOUVELLE VARIABLE: Stocke le fichier réel
  newCategoryFile: File | null = null;

  /**
   * Intercepte la sélection du fichier par l'utilisateur.
   * @param event L'événement de changement du champ input type="file".
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.newCategoryFile = input.files[0];
    } else {
      this.newCategoryFile = null;
    }
  }

  /**
   * Gère l'ajout d'une nouvelle catégorie OU la mise à jour d'une catégorie existante.
   */
  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    // Déterminer le nom de la photo/du fichier pour la sauvegarde
    const photoName = this.newCategoryFile ? this.newCategoryFile.name : 'placeholder.png';

    // 1. CAS: MISE À JOUR (Mode Édition actif)
    if (this.categoryToEditId !== null) {

      this.categories.update(list =>
        list.map(c => c.id === this.categoryToEditId ? {
            ...c,
            name,
            description: this.newCategoryDescription.trim() || c.description,
            photo: this.newCategoryFile ? photoName : c.photo,
            active: !!this.newCategoryActive,
        } : c)
      );

    } else {
      // 2. CAS: AJOUT (Mode Édition inactif)
      const newCat: Category = {
        id: Date.now(),
        name,
        description: this.newCategoryDescription.trim() || 'Nouvelle catégorie',
        photo: photoName,
        iconClass: this.defaultIcon.class,
        iconColorClass: this.defaultIcon.color,
        missions: 0,
        active: !!this.newCategoryActive,
      };

      this.categories.update(list => [newCat, ...list]);
    }

    // Réinitialisation du formulaire et sortie du mode édition
    this.resetForm();
  }

  /** * Active le mode édition et pré-remplit le formulaire.
   * @param id L'ID de la catégorie à éditer.
   */
  updateCategory(id: number) {
    const categoryToEdit = this.categories().find(c => c.id === id);

    if (categoryToEdit) {
        // 1. Mémoriser l'ID pour le mode MÀJ
        this.categoryToEditId = id;

        // 2. Pré-remplir le formulaire
        this.newCategoryName = categoryToEdit.name;
        // Pour le champ de fichier, on ne peut pas pré-remplir l'objet File.
        // On laisse la variable du fichier à null et on affiche le nom dans le champ s'il y a un champ d'affichage (ici on se contente de l'afficher dans la table)
        this.newCategoryFile = null;
        this.newCategoryDescription = categoryToEdit.description;
        this.newCategoryActive = categoryToEdit.active;
    }
  }

  /**
   * Réinitialise les champs du formulaire et le mode édition.
   */
  resetForm() {
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.newCategoryActive = true;
    this.categoryToEditId = null;
    this.newCategoryFile = null; // Réinitialise le fichier sélectionné

    // Optionnel: Réinitialiser manuellement le champ input type="file" dans le DOM si nécessaire
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // --- Méthodes de Suppression et Toggle ---

  deleteCategory(id: number) {
    this.categoryToDeleteId = id;
    this.deleteModal.open();
  }

  confirmDeletion() {
    if (this.categoryToDeleteId === null) return;

    this.categories.update(list => list.filter(c => c.id !== this.categoryToDeleteId));

    this.successModal.open();

    this.categoryToDeleteId = null;
  }

  toggleCategory(cat: Category) {
    this.categories.update(list =>
      list.map(c => c.id === cat.id ? { ...c, active: !c.active } : c)
    );
  }

  // getters utiles
  get totalCategories() {
    return this.categories().length;
  }

  get newThisMonth() {
    return 3;
  }
}
