import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Data } from '../../services/data';
import { Env } from '../../env';

interface Category {
  id: number;
  name: string;
  description: string;
  photo: string; // URL complète de la photo renvoyée par le backend
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
export class CategoriesComponent implements OnInit {

  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('successModal') successModal!: ModalComponent;

  constructor(private data: Data, private http: HttpClient) {}

  categoryToDeleteId: number | null = null;
  categoryToEditId: number | null = null;

  // Données chargées depuis le backend
  categories = signal<Category[]>([]);

  loading = false;
  error: string | null = null;

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

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.data.getData(Env.ADMIN + 'categories').subscribe({
      next: (res: any) => {
        const baseUrl = 'http://localhost:8080';
        const mapped: Category[] = (res || []).map((item: any) => ({
          id: item.id,
          name: item.nom,
          description: item.description,
          photo: baseUrl + item.urlPhoto,
          iconClass: this.defaultIcon.class,
          iconColorClass: this.defaultIcon.color,
          missions: item.missionsCount,
          active: true,
        }));

        this.categories.set(mapped);
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.error = 'Erreur lors du chargement des catégories';
        this.loading = false;
      },
    });
  }

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
    const formData = new FormData();
    formData.append('nom', name);
    formData.append('description', this.newCategoryDescription.trim());
    if (this.newCategoryFile) {
      formData.append('photo', this.newCategoryFile);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Mode édition : PUT /admin/categories/{id}
    if (this.categoryToEditId !== null) {
      this.http.put<any>(`${Env.ADMIN}categories/${this.categoryToEditId}`, formData, { headers }).subscribe({
        next: (res: any) => {
          const baseUrl = 'http://localhost:8080';
          if (res && res.data) {
            const item = res.data;
            this.categories.update(list => list.map(c =>
              c.id === this.categoryToEditId
                ? {
                    id: item.id,
                    name: item.nom,
                    description: item.description,
                    photo: baseUrl + item.urlPhoto,
                    iconClass: this.defaultIcon.class,
                    iconColorClass: this.defaultIcon.color,
                    missions: item.missionsCount,
                    active: c.active,
                  }
                : c
            ));
          }
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      // Mode création : POST /admin/categories
      this.http.post<any>(Env.ADMIN + 'categories', formData, { headers }).subscribe({
        next: (res: any) => {
          const baseUrl = 'http://localhost:8080';
          if (res && res.data) {
            const item = res.data;
            const newCat: Category = {
              id: item.id,
              name: item.nom,
              description: item.description,
              photo: baseUrl + item.urlPhoto,
              iconClass: this.defaultIcon.class,
              iconColorClass: this.defaultIcon.color,
              missions: item.missionsCount,
              active: true,
            };
            this.categories.update(list => [newCat, ...list]);
          }
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete<any>(`${Env.ADMIN}categories/${this.categoryToDeleteId}`, { headers }).subscribe({
      next: () => {
        this.categories.update(list => list.filter(c => c.id !== this.categoryToDeleteId));
        this.successModal.open();
        this.categoryToDeleteId = null;
      },
      error: (err) => {
        console.log(err);
      },
    });
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
