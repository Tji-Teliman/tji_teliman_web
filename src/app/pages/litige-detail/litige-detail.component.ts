import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Ajout de RouterOutlet pour la démo, même s'il n'est pas strictement utilisé ici

// Interface pour définir la structure d'un litige
interface Litige {
  no: number;
  jeune: string;
  jeunePhoto: string;
  jeuneEmail: string;
  recruteur: string;
  recruteurPhoto: string;
  recruteurEmail: string;
  mission: string;
  missionId: string;
  statut: 'En attente' | 'En cours' | 'Résolu' | 'Fermé';
  montant: string;
  dateCreation: string;
  derniereMiseAJour: string;
  resolutionPrevue: string;
  description: string;
}

@Component({
  // Rétabli le nom du composant à LitigesComponent pour la cohérence
  selector: 'app-litiges-detail',
  standalone: true,
  // Ajout de RouterOutlet juste pour éviter les warnings non liés à ce composant si jamais il est utilisé
  imports: [CommonModule, RouterOutlet], 
  
  // J'utilise les noms de fichiers de votre erreur pour l'instant, 
  // car l'erreur NG2008 indique que vous utilisez ce chemin local.
  // NOTE: Dans un projet standard, le nom serait plutôt './litiges.component.html'
  templateUrl: './litige-detail.component.html', 
  styleUrls: ['./litige-detail.component.css']
})
// Le nom de la classe est de nouveau LitigesComponent pour englober la liste et le détail
export class LitigesDetailComponent implements OnInit { 

  // CORRECTION MAJEURE: Le type doit être 'Litige[]' et non 'LitigesComponent[]'
  private litigesDataSource: Litige[] = [
    {
      no: 1,
      jeune: 'Marie Dupont',
      jeunePhoto: 'https://placehold.co/100x100/374151/ffffff?text=MD',
      jeuneEmail: 'marie.dupont@email.com',
      recruteur: 'Tech Innovations Corp',
      recruteurPhoto: 'https://placehold.co/100x100/10B981/ffffff?text=TI',
      recruteurEmail: 'recruteur@tech.com',
      mission: 'Développement d\'une API REST',
      missionId: 'MIS-2024-452',
      statut: 'En attente',
      montant: '850 €',
      dateCreation: '15/10/2024',
      derniereMiseAJour: '18/10/2024',
      resolutionPrevue: '25/10/2024',
      description: "Le jeune n'a pas été payé pour la mission effectuée. Le recruteur affirme que le travail est incomplet."
    },
    {
      no: 2,
      jeune: 'Thomas Dubois',
      jeunePhoto: 'https://placehold.co/100x100/F97316/ffffff?text=TD',
      recruteur: 'Marketing Plus',
      recruteurPhoto: 'https://placehold.co/100x100/FACC15/ffffff?text=MP',
      jeuneEmail: 'thomas.dubois@email.com',
      recruteurEmail: 'contact@marketingp.fr',
      mission: 'Conception d\'une campagne publicitaire',
      missionId: 'MIS-2024-453',
      statut: 'En cours',
      montant: '1 200 €',
      dateCreation: '01/10/2024',
      derniereMiseAJour: '20/10/2024',
      resolutionPrevue: '30/10/2024',
      description: "Le recruteur a annulé la mission après le début, sans compensation pour le travail déjà fourni."
    },
    {
      no: 3,
      jeune: 'Sofia Lacroix',
      jeunePhoto: 'https://placehold.co/100x100/9333EA/ffffff?text=SL',
      recruteur: 'Global Solutions',
      recruteurPhoto: 'https://placehold.co/100x100/3B82F6/ffffff?text=GS',
      jeuneEmail: 'sofia.lacroix@email.com',
      recruteurEmail: 'support@globalsol.com',
      mission: 'Audit de sécurité Web',
      missionId: 'MIS-2024-454',
      statut: 'Résolu',
      montant: '500 €',
      dateCreation: '05/09/2024',
      derniereMiseAJour: '10/09/2024',
      resolutionPrevue: '10/09/2024',
      description: "Problème de communication résolu. Paiement effectué après médiation."
    },
    {
      no: 4,
      jeune: 'Alex Martin',
      jeunePhoto: 'https://placehold.co/100x100/BE185D/ffffff?text=AM',
      recruteur: 'Innovation X',
      recruteurPhoto: 'https://placehold.co/100x100/22C55E/ffffff?text=IX',
      jeuneEmail: 'alex.martin@email.com',
      recruteurEmail: 'jobs@innovationx.net',
      mission: 'Traduction de documentation technique',
      missionId: 'MIS-2024-455',
      statut: 'Fermé',
      montant: '300 €',
      dateCreation: '20/08/2024',
      derniereMiseAJour: '25/08/2024',
      resolutionPrevue: '25/08/2024',
      description: "Dossier classé sans suite, litige jugé non recevable."
    }
  ];

  // État de l'application (utilisé par le template HTML)
  litigesAffiches = signal<Litige[]>([]);
  litigeSelectionne = signal<Litige | null>(null);

  // Filtres disponibles
  filtres: string[] = ['Tous', 'En attente', 'En cours', 'Résolu', 'Fermé'];
  filtreActif: string = 'Tous';

  ngOnInit() {
    // Initialise la liste affichée avec toutes les données au démarrage
    this.litigesAffiches.set(this.litigesDataSource);
  }

  // Logique de filtrage des litiges pour la vue de liste
  filtrerLitiges(filtre: string) {
    this.filtreActif = filtre;
    if (filtre === 'Tous') {
      this.litigesAffiches.set(this.litigesDataSource);
    } else {
      this.litigesAffiches.set(this.litigesDataSource.filter(l => l.statut === filtre));
    }
  }

  // Logique pour basculer vers la vue de détail
  voirDetails(litige: Litige) {
    this.litigeSelectionne.set(litige);
  }

  // Logique pour revenir à la liste
  retourListe() {
    this.litigeSelectionne.set(null);
  }

  // Logique pour déterminer la classe CSS du statut
  getStatutClass(statut: Litige['statut']): string {
    switch (statut) {
      case 'En attente':
        return 'en-attente';
      case 'En cours':
        return 'en-cours';
      case 'Résolu':
        return 'resolu';
      case 'Fermé':
        return 'ferme';
      default:
        return '';
    }
  }

  // Fonctions de gestion d'actions (à implémenter pour la gestion réelle)
  traiterLitige() {
    // Dans une application réelle, cela ouvrirait un modal ou une étape de traitement
    console.log(`Action: Traiter le litige N° ${this.litigeSelectionne()?.no}`);
  }

  resoudreLitige() {
    // Dans une application réelle, cela lancerait le processus de résolution finale
    console.log(`Action: Résoudre le litige N° ${this.litigeSelectionne()?.no}`);
  }
}
