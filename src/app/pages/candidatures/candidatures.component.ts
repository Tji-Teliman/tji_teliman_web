import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Pour *ngIf, *ngFor
import { ModalComponent } from '../../components/modal/modal.component'; // Si vous utilisez le modal ici
import { FormsModule } from '@angular/forms';
interface Candidature {
  id: number;
  candidateName: string;
  candidatePhoto: string;
  motivation: string;
  status: 'tout' | 'valider' | 'rejeter';
}

@Component({
  selector: 'app-candidatures',
  standalone: true, 
  imports: [CommonModule,FormsModule], // Importez ModalComponent si vous l'utilisez pour les actions
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css']
})
export class CandidaturesComponent implements OnInit {
  searchText = '';
  onSearchChange() {
    console.log('Recherche :', this.searchText);
  }
  missionId: number | null = null;
  missionTitle: string = 'Chargement...';
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  currentFilter: 'tout' | 'valider' | 'rejeter' = 'tout';
  
  // ID de la candidature sélectionnée pour le menu d'action ou le modal
  selectedCandidatureId: number | null = null;
  
  //  NOUVEAU GETTER : Calcule le nombre de candidatures validées
  get validatedCount(): number {
    // Vérifie d'abord que candidatures existe et n'est pas null
    return this.candidatures ? this.candidatures.filter(c => c.status === 'valider').length : 0;
  }

  // NOUVEAU GETTER : Calcule le nombre de candidatures rejetées
  get rejectedCount(): number {
    return this.candidatures ? this.candidatures.filter(c => c.status === 'rejeter').length : 0;
  }
  // Injectez ActivatedRoute et Router
  constructor(private route: ActivatedRoute, private router: Router) { } 

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.missionId = +id;
        this.loadMissionDetails(this.missionId);
        this.loadCandidatures(this.missionId);
      } else {
        this.router.navigate(['/missions']);
      }
    });
  }

  loadMissionDetails(id: number): void {
    // Simuler le chargement du titre de la mission
    this.missionTitle = 'Aide Ménagère'; 
  }

  loadCandidatures(id: number): void {
    const baseCandidatures = [
      { id: 1, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'valider' },
      { id: 2, candidateName: 'Sophie Marc', candidatePhoto: 'profil.png', motivation: 'J\'ai l\'expérience nécessaire pour ce type de...', status: 'rejeter' },
      { id: 3, candidateName: 'Pierre Louis', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'tout' },
    ];

    const fillerCandidatures = Array(9).fill(0).map((_, i) => ({ 
        id: 4 + i, 
        candidateName: 'Jean Dupont', 
        candidatePhoto: 'jean.png', 
        motivation: 'Je suis très motivée par cette mission, j...', 
        status: i % 2 === 0 ? 'rejeter' : 'tout' 
    }));

    this.filterCandidatures(this.currentFilter);
  }

  filterCandidatures(filter: 'tout' | 'valider' | 'rejeter'): void {
    this.currentFilter = filter;
    if (filter === 'tout') {
      this.filteredCandidatures = this.candidatures;
    } else {
      this.filteredCandidatures = this.candidatures.filter(c => c.status === filter);
    }
  }

  // --- Logique du menu d'action ---

  // Ouvrir le menu d'action ou le modal pour une candidature
  openActionMenu(id: number): void {
    // Utiliser cette méthode si vous utilisez un menu déroulant CSS/TS, 
    // sinon vous pouvez appeler directement le modal de confirmation
    this.selectedCandidatureId = id;
    console.log('Action menu ouvert pour la candidature ID:', id);
    // Logique pour afficher le menu déroulant à côté des 3 points
  }
  
  supprimerCandidature(id: number): void {
    if (confirm("Voulez-vous supprimer cette candidature ?")) {
      console.log('Suppression de la candidature:', id);
      // Logique API de suppression
    }
  }

  bloquerCandidat(id: number): void {
    if (confirm("Voulez-vous bloquer ce candidat ?")) {
      console.log('Blocage du candidat pour la candidature:', id);
      // Logique API de blocage
    }
  }

  goBack(): void {
    // Retourne à la page de détail de la mission
    this.router.navigate(['/mission-detail', this.missionId]);
  }
}