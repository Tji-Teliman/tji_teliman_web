import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { Env } from '../../env';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  // Injectez ActivatedRoute, Router, Data et HttpClient pour la navigation et les appels API
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: Data,
    private http: HttpClient,
  ) { }

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
    if (this.missionToDeleteId === null) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const deleteUrl = `${Env.API_URL}missions/${this.missionToDeleteId}`;

    this.http.delete<any>(deleteUrl, { headers }).subscribe({
      next: () => {
        // Fermer le modal de confirmation et afficher le succès
        this.deleteMissionModal.close();
        this.successDeleteMissionModal.open();

        // Après un court délai, fermer le succès et retourner à la liste des missions
        setTimeout(() => {
          this.successDeleteMissionModal.close();
          this.router.navigate(['/missions']);
        }, 1500);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Gérer la redirection vers la liste des missions
  goBack(): void {
    this.router.navigate(['/missions']);
  }
}
