import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Data } from '../../services/data';
import { Env } from '../../env';

// Interface pour définir la structure d'une mission
interface Mission {
  id: string;
  titre: string;
  recruteur: string;
  dateDebut: string; // Format JJ/MM/AAAA
  dateFin: string;   // Format JJ/MM/AAAA
  remuneration: string; // Inclut FCFA
  categorie: string;
  categorieNom?: string;
  recruteurNom?:string;
  recruteurPrenom?:string;
}

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule, FaIconComponent,RouterModule],
  templateUrl: './missions.html',
  styleUrl: './missions.css',

})
export class Missions implements OnInit {
faEye = faEye; // Exposer l'icône au template
  // Données pour les cartes statistiques (si elles ne viennent pas d'un service)
  totalMissions = 0;
  missionsTerminees = 0;
  missionsNonTerminees = 0;
  publieesCeMois = 0;

  // Données pour le tableau des missions
  missions: Mission[] = [];

  missionList : any;

  constructor(private router: Router,private data:Data) { }

  ngOnInit(): void {
    this.data.getData(Env.ADMIN+'missions').subscribe({
      next:(res:any) =>{
        console.log(res);
        this.missions = res.missions
        this.totalMissions = res.totalMissionsPubliees ;
        this.missionsTerminees = res.totalMissionsTerminees;

        this.missionsNonTerminees = res.totalMissionsNonTerminees;

        this.publieesCeMois = res.totalMissionsPublieesCeMoisCi;
      },
      error(err) {
          console.log(err);
      },
    })
  }

  // Fonction pour gérer le clic sur le bouton d'action (l'œil)
  voirDetailsMission(mission: Mission): void {
    console.log('Afficher les détails de la mission :', mission.titre);
    this.router.navigate(['/mission-detail', mission.id]);
  }

}
