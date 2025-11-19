import { Component, OnInit, ViewChild } from '@angular/core'; // AJOUTER ViewChild
import { ActivatedRoute, Router } from '@angular/router'; // AJOUTER Router
// Importez vos modals si ce sont des composants séparés
import { ModalComponent } from '../../components/modal/modal.component'; // Ajustez le chemin si nécessaire
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { Env } from '../../env';

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
  constructor(private route: ActivatedRoute, private router: Router, private data:Data) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.missionId = +id;
        this.data.getDataById(Env.MISSION+'/',this.missionId).subscribe(
          {
            next:(res:any)=>{
              this.mission = res.data;
              // Adapter certaines propriétés pour le template
              this.mission.etoile = this.mission.recruteurNote ?? 5;

              // Normaliser le chemin de la photo du recruteur en URL HTTP
              if (this.mission.recruteurUrlPhoto) {
                const rawPath: string = this.mission.recruteurUrlPhoto;
                const uploadIndex = rawPath.toLowerCase().indexOf('uploads');
                const relativePath = uploadIndex >= 0 ? rawPath.substring(uploadIndex) : rawPath;
                const normalized = relativePath.replace(/\\/g, '/');
                const baseUrl = 'http://localhost:8080/';
                this.mission.recruteurUrlPhoto = baseUrl + normalized;
              }
              console.log(res.data)
            },
            error(err) {
              console.log(err);
            },
          }
        )
      } else {
        // Gérer le cas où l'ID est manquant, par exemple rediriger
        this.router.navigate(['/missions']);
      }
    });
  }

  // Les détails de la mission sont désormais entièrement chargés depuis l'API.

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
