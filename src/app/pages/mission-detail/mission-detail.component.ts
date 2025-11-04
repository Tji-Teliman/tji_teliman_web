import { Component, OnInit, ViewChild } from '@angular/core'; // AJOUTER ViewChild
import { ActivatedRoute, Router } from '@angular/router'; // AJOUTER Router
// Importez vos modals si ce sont des composants séparés
import { ModalComponent } from '../../components/modal/modal.component'; // Ajustez le chemin si nécessaire
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule ,ModalComponent,RouterLink,FormsModule],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  missionId: number | null = null;
  mission: any = null; // Remplacez 'any' par l'interface de votre objet Mission

  // Références aux modals pour la suppression
  @ViewChild('deleteMissionModal') deleteMissionModal!: ModalComponent;
  @ViewChild('successDeleteMissionModal') successDeleteMissionModal!: ModalComponent;
  
  missionToDeleteId: number | null = null;

  // Injectez ActivatedRoute et Router pour la navigation
  constructor(private route: ActivatedRoute, private router: Router /*, private missionService: MissionService */) { } 

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.missionId = +id;
        this.loadMissionDetails(this.missionId);
      } else {
        // Gérer le cas où l'ID est manquant, par exemple rediriger
        this.router.navigate(['/missions']); 
      }
    });
  }

  loadMissionDetails(id: number): void {
    // Simuler le chargement des données pour l'exemple
    // Normalement, vous feriez un appel à votre MissionService ici.
    this.mission = {
      id: id,
      recruiter: {
        name: 'Amadou B.',
        photo: 'hommepro.png',
        rating: 4 // Nombre d'étoiles
      },
      title: 'Aide Ménagère', // Titre de la mission (utilisé dans le header)
      description: 'Déménagement d’un appartement situé au 2e étage sans ascenseur.\nAide au transport de cartons et de quelques meubles démontés jusqu’au camion de déménagement.\nUne autre personne sera présente pour prêter main-forte.',
      requirements: [
        'Force physique à sécurité',
        'Disponibilité le matin'
      ],
      location: 'Kalaban Coura',
      estimatedTime: '3 heures',
      dueDate: '25/10/25',
      status: 'active' // Pourrait être 'active', 'completed', 'canceled'
    };
  }

  // --- LOGIQUE DE SUPPRESSION ---
  
  // Ouvre le modal de confirmation de suppression
  openDeleteMissionConfirmation(missionId: number): void {
    this.missionToDeleteId = missionId;
    this.deleteMissionModal.open();
  }

  // Gère la confirmation de suppression
  confirmDeletion(): void {
    if (this.missionToDeleteId !== null) {
      console.log(`Suppression de la mission ID: ${this.missionToDeleteId}`);
      // Ici, vous feriez l'appel à votre service pour supprimer la mission
      // this.missionService.deleteMission(this.missionToDeleteId).subscribe(() => { ... });

      // Simuler la suppression réussie
      this.deleteMissionModal.close();
      this.successDeleteMissionModal.open();
      
      // Après un court délai, rediriger vers la liste des missions
      setTimeout(() => {
        this.successDeleteMissionModal.close();
        this.router.navigate(['/missions']); 
      }, 1500); 
    }
  }

  // Gérer la redirection vers la liste des missions
  goBack(): void {
    this.router.navigate(['/missions']);
  }
}