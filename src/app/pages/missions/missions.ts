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
  totalMissions = 850;
  missionsTerminees = 420;
  missionsNonTerminees = 310;
  publieesCeMois = 95;

  // Données pour le tableau des missions
  missions: Mission[] = [
{
    id: '101', 
    titre: 'Aide Menagère',
    recruteur: 'Aminata Diallo',
    dateDebut: '10/01/2025',
    dateFin: '13/01/2025',
    remuneration: '15.000 FCFA',
    categorie: 'Aide domestique'
  },
  {
    id: '102', 
    titre: 'Cours de Maths (3e)',
    recruteur: 'Fatou Diarra',
    dateDebut: '05/02/2025',
    dateFin: '05/05/2025',
    remuneration: '50.000 FCFA',
    categorie: 'Éducation & Soutien'
  },
  {
    id: '103', 
    titre: 'Déménagement (2e étage)',
    recruteur: 'Amadou B.',
    dateDebut: '20/02/2025',
    dateFin: '20/02/2025',
    remuneration: '25.000 FCFA',
    categorie: 'Manutention & Logistique'
  },
  {
    id: '104', 
    titre: 'Développement Web (Junior)',
    recruteur: 'Moussa Tech SARL',
    dateDebut: '01/03/2025',
    dateFin: '30/06/2025',
    remuneration: '350.000 FCFA',
    categorie: 'Informatique & IT'
  },
  {
    id: '105', 
    titre: 'Réparation Climatiseur',
    recruteur: 'Société IMMO',
    dateDebut: '15/03/2025',
    dateFin: '16/03/2025',
    remuneration: '40.000 FCFA',
    categorie: 'Réparation & Maintenance'
  },
  {
    id: '106', 
    titre: 'Traduction Français-Anglais',
    recruteur: 'Agence Global',
    dateDebut: '01/04/2025',
    dateFin: '15/04/2025',
    remuneration: '120.000 FCFA',
    categorie: 'Langues & Traduction'
  },
  ];

  constructor(private router: Router,private data:Data) { }

  ngOnInit(): void {
    this.data.getData(Env.ADMIN+'missions').subscribe({
      next(res) {
          console.log(res)
      },
      error(err) {
          console.log(err);
      },
    })
  }

  // Fonction pour gérer le clic sur le bouton d'action (l'œil)
  voirDetailsMission(mission: Mission): void {
    console.log('Afficher les détails de la mission :', mission.titre);
    this.router.navigate(['/mission-detail', mission.id]);    // Logique de navigation ou d'affichage de modal ici
  }
}
