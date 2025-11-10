import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component'; 
import { FormsModule } from '@angular/forms';

interface Candidature {
  id: number;
  candidateName: string;
  candidatePhoto: string;
  motivation: string;
  // 'rejeter' = Bloqué (carte rouge). 'tout' = Débloqué/En attente (carte blanche).
  status: 'tout' | 'valider' | 'rejeter'; 
}

@Component({
  selector: 'app-candidatures',
  standalone: true, 
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css']
})
export class CandidaturesComponent implements OnInit {
  searchText = '';
  missionId: number | null = null;
  missionTitle: string = 'Chargement...';
  candidatures: Candidature[] = []; 
  filteredCandidatures: Candidature[] = []; 
  currentFilter: 'tout' | 'valider' | 'rejeter' = 'tout';
  selectedCandidatureId: number | null = null;
  
  // LOGIQUE MODAL DE SUPPRESSION
  isDeleteModalOpen: boolean = false;
  candidatureToDelete: Candidature | null = null;

  // LOGIQUE MODAL DE BLOCAGE
  isBlockModalOpen: boolean = false;
  candidatureToBlock: Candidature | null = null;
  
  // LOGIQUE MODAL DE DÉBLOCAGE
  isUnblockModalOpen: boolean = false;
  candidatureToUnblock: Candidature | null = null;


  // Getters pour les compteurs des onglets
  get validatedCount(): number {
    return this.candidatures ? this.candidatures.filter(c => c.status === 'valider').length : 0;
  }

  get rejectedCount(): number {
    return this.candidatures ? this.candidatures.filter(c => c.status === 'rejeter').length : 0;
  }
  
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
    this.missionTitle = 'Aide Ménagère'; 
  }

  loadCandidatures(id: number): void {
    const baseCandidatures: Candidature[] = [ 
      // 1 validé, 11 rejetés/bloqués initialement
      { id: 1, candidateName: 'Sophie Marc', candidatePhoto: 'profil.png', motivation: 'Candidature validée par le système...', status: 'valider' },
      { id: 2, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'J\'ai l\'expérience nécessaire pour ce type de...', status: 'rejeter' },
      { id: 3, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 4, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 5, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 6, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 7, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 8, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 9, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 10, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 11, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
      { id: 12, candidateName: 'Jean Dupont', candidatePhoto: 'profil.png', motivation: 'Je suis très motivée par cette mission, j...', status: 'rejeter' },
    ];
    
    this.candidatures = baseCandidatures;
    this.filterCandidatures(this.currentFilter); 
  }

  filterCandidatures(filter: 'tout' | 'valider' | 'rejeter'): void {
    this.currentFilter = filter;
    
    let tempCandidatures = this.candidatures;
    
    if (filter !== 'tout') {
      tempCandidatures = tempCandidatures.filter(c => c.status === filter);
    }
    
    if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        tempCandidatures = tempCandidatures.filter(c => 
            c.candidateName.toLowerCase().includes(searchLower) ||
            c.motivation.toLowerCase().includes(searchLower)
        );
    }
    
    this.filteredCandidatures = tempCandidatures;
  }
  
  onSearchChange(): void {
    this.filterCandidatures(this.currentFilter); 
  }

  openActionMenu(id: number): void {
    this.selectedCandidatureId = (this.selectedCandidatureId === id) ? null : id;
  }
  
  // --- Suppression ---
  confirmDelete(id: number): void {
    const cand = this.candidatures.find(c => c.id === id);
    if (cand) {
      this.candidatureToDelete = cand;
      this.isDeleteModalOpen = true; 
      this.selectedCandidatureId = null; 
    }
  }

  supprimerCandidatureConfirm(): void {
    if (this.candidatureToDelete) {
      const id = this.candidatureToDelete.id;
      
      this.candidatures = this.candidatures.filter(c => c.id !== id);
      this.filterCandidatures(this.currentFilter); 
      
      this.candidatureToDelete = null;
    }
    this.isDeleteModalOpen = false; 
  }

  // --- Blocage (-> Rouge) ---
  confirmBlock(id: number): void {
    const cand = this.candidatures.find(c => c.id === id);
    if (cand) {
      this.candidatureToBlock = cand;
      this.isBlockModalOpen = true; 
      this.selectedCandidatureId = null; 
    }
  }

  bloquerCandidatConfirm(): void {
    if (this.candidatureToBlock) {
      const id = this.candidatureToBlock.id;
      
      // Mise à jour via map pour rafraîchissement forcé
      const newCandidatures = this.candidatures.map(c => {
        if (c.id === id) {
            return { ...c, status: 'rejeter' as const }; 
        }
        return c;
      });
      
      this.candidatures = newCandidatures;
      this.filterCandidatures(this.currentFilter); 
      this.candidatureToBlock = null;
    }
    this.isBlockModalOpen = false;
  }
  
  // --- Déblocage (-> Blanc) ---
  confirmUnblock(id: number): void {
    const cand = this.candidatures.find(c => c.id === id);
    if (cand) {
      this.candidatureToUnblock = cand;
      this.isUnblockModalOpen = true; 
      this.selectedCandidatureId = null; 
    }
  }

  debloquerCandidatConfirm(): void {
    if (this.candidatureToUnblock) {
      const id = this.candidatureToUnblock.id;
      
      // Mise à jour via map pour rafraîchissement forcé
      const newCandidatures = this.candidatures.map(c => {
        if (c.id === id) {
            return { ...c, status: 'tout' as const }; 
        }
        return c;
      });
      
      this.candidatures = newCandidatures;
      this.filterCandidatures(this.currentFilter); 
      this.candidatureToUnblock = null;
    }
    this.isUnblockModalOpen = false;
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/mission-detail', this.missionId]);
  }
}