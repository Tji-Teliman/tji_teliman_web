// src/app/pages/categories/categories.component.ts

import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { Data } from '../../services/data';
import { Env } from '../../env';

interface Category {
  id: number;
  name: string;
  description: string;
  photo: string; // Gardé pour la compatibilité, mais non utilisé pour l'icône dans le tableau
  // ⬅️ NOUVELLES PROPRIÉTÉS
  iconClass: string;
  iconColorClass: string;
  missions: number;
  active: boolean;
}

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, AdminHeaderComponent, ModalComponent],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class CategoriesComponent implements OnInit {
  // ... (ViewChild et categoryToDeleteId inchangés)
  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('successModal') successModal!: ModalComponent;
  categoryToDeleteId: number | null = null;

  // Données initiales mises à jour avec les classes d'icônes
  categories = signal<Category[]>([
    {
      id: 1,
      name: 'Livraison',
      description: 'Transport de colis et courses',
      photo: 'camion.png',
      missions: 156,
      active: true,
      iconClass: 'fa-truck',
      iconColorClass: 'icon-delivery',
    },
    {
      id: 2,
      name: 'Enseignement',
      description: 'Cours particuliers et soutien scolaire',
      photo: 'prof.png',
      missions: 89,
      active: true,
      iconClass: 'fa-calculator',
      iconColorClass: 'icon-math',
    },
    {
      id: 3,
      name: 'Aide domestique',
      description: 'Ménage, cuisine, jardinage',
      photo: 'nettoyer.png',
      missions: 124,
      active: true,
      iconClass: 'fa-broom',
      iconColorClass: 'icon-cleaning',
    },
    {
      id: 4,
      name: 'Événementiel',
      description: 'Animation, DJ, organisation',
      photo: 'fete.png',
      missions: 45,
      active: false,
      iconClass: 'fa-music',
      iconColorClass: 'icon-event',
    },
    {
      id: 5,
      name: 'Manutention',
      description: 'Déménagement, manutention, aide aux tâches',
      photo: 'aide.png',
      missions: 124,
      active: true,
      iconClass: 'fa-wrench',
      iconColorClass: 'icon-default',
    },
  ]);

  constructor(private data:Data) {}

  ngOnInit(): void {
    this.data.getData(Env.ADMIN+'categories').subscribe({
      next(res) {
          console.log(res);
      },
      error(err) {
          console.log(err);
      },
    })
  }

  // Définition d'icônes pour l'ajout rapide
  defaultIcon = {
    class: 'fa-tag',
    color: 'icon-default',
  };

  // formulaire (variables simples)
  newCategoryName = '';
  newCategoryPhoto = '';
  newCategoryDescription = '';
  newCategoryActive = true;

  // Méthodes CRUD
  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    const newCat: Category = {
      id: Date.now(),
      name,
      description: this.newCategoryDescription.trim() || 'Nouvelle catégorie',
      photo: this.newCategoryPhoto.trim() || 'placeholder.png',
      // ⬅️ Utilisation des classes d'icônes par défaut
      iconClass: this.defaultIcon.class,
      iconColorClass: this.defaultIcon.color,
      missions: 0,
      active: !!this.newCategoryActive,
    };

    this.categories.update((list) => [newCat, ...list]);

    // reset formulaire
    this.newCategoryName = '';
    this.newCategoryPhoto = '';
    this.newCategoryDescription = '';
    this.newCategoryActive = true;
  }

  // ... (deleteCategory, confirmDeletion, toggleCategory, updateCategory, getters inchangés)

  // 3. Méthode pour ouvrir le modal de confirmation
  deleteCategory(id: number) {
    this.categoryToDeleteId = id; // Stocke l'ID
    this.deleteModal.open(); // Ouvre le modal de confirmation
  }

  // 4. Nouvelle méthode appelée après le clic sur 'Confirmer' dans le modal
  confirmDeletion() {
    if (this.categoryToDeleteId === null) return;

    // Suppression de la catégorie
    this.categories.update((list) => list.filter((c) => c.id !== this.categoryToDeleteId));

    // Affichage du modal de succès
    this.successModal.open();

    // Réinitialisation de l'ID après la suppression
    this.categoryToDeleteId = null;
  }

  toggleCategory(cat: Category) {
    this.categories.update((list) =>
      list.map((c) => (c.id === cat.id ? { ...c, active: !c.active } : c))
    );
  }

  updateCategory(id: number) {
    // placeholder — tu peux ouvrir un modal ou remplir le formulaire droit pour éditer
    console.log('Edit category', id);
  }

  // getters utiles
  get totalCategories() {
    return this.categories().length;
  }

  get newThisMonth() {
    return 3;
  }
}
