import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
import { Router } from '@angular/router';
// Définition du type de données
interface Litige {
    no: number;
    jeune: string;
    recruteur: string;
    mission: string;
    statut: 'En Cours' | 'En attente' | 'Resolu' | 'Fermé';
    montant: string;
    dateCreation: string;
}

// Les statuts affichés sur les boutons de filtre, dans l'ordre du design
type FiltreStatut = 'Tous' | 'En Cours' | 'Resolus' | 'Ouvert' | 'Fermé';

@Component({
    selector: 'app-litiges',
    standalone: true,
    imports: [CommonModule , AdminHeaderComponent],
    templateUrl:'./litiges.html', // Assurez-vous du nom de fichier correct
    styleUrl: './litiges.css',   // Assurez-vous du nom de fichier correct
})
export class LitigesComponent implements OnInit {

    // Les statuts des boutons de filtre, dans l'ordre spécifié par le design
    constructor(private router: Router) { }
    public readonly filtres: FiltreStatut[] = ['Tous', 'En Cours', 'Resolus', 'Ouvert', 'Fermé'];

    // Données fixes (Source de vérité pour le tableau des litiges)
    private readonly donneesLitiges: Litige[] = [
        { no: 1, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "En Cours", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
        { no: 2, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "En attente", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
        { no: 3, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "Resolu", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
        { no: 4, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "Fermé", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
        { no: 5, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "En Cours", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
        { no: 6, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "En Cours", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
        { no: 7, jeune: "Moussa Cisse", recruteur: "Mohamed Traoré", mission: "Mission de livraison", statut: "En Cours", montant: "15.000 FCFA", dateCreation: "10/01/2025" },
    ];

    // Tableau actuellement affiché, mis à jour par les filtres
    public litigesAffiches: Litige[] = [];
    // Le filtre actif par défaut au chargement
    public filtreActif: FiltreStatut = 'Tous';

    ngOnInit(): void {
        // Au démarrage du composant, afficher tous les litiges
        this.litigesAffiches = [...this.donneesLitiges];
    }

    /**
     * Gère la logique de filtrage du tableau en fonction du bouton cliqué.
     * Met à jour `litigesAffiches` et `filtreActif`.
     * @param statut Le statut sélectionné ('Tous', 'En Cours', etc.).
     */
    filtrerLitiges(statut: FiltreStatut): void {
        this.filtreActif = statut; // Met à jour l'état du bouton actif

        if (statut === 'Tous') {
            this.litigesAffiches = [...this.donneesLitiges];
        } else {
            let statutRecherche: Litige['statut'] | null = null;

            // Mapping du libellé du filtre vers la valeur de statut dans les données
            switch (statut) {
                case 'Resolus': statutRecherche = 'Resolu'; break;
                // 'Ouvert' peut être mappé à 'En Cours' ou à un autre statut si défini
                case 'Ouvert': statutRecherche = 'En Cours'; break;
                case 'En Cours': statutRecherche = 'En Cours'; break;
                case 'Fermé': statutRecherche = 'Fermé'; break;
                default: statutRecherche = statut as Litige['statut'];
            }

            if (statutRecherche) {
                this.litigesAffiches = this.donneesLitiges.filter(litige =>
                    litige.statut === statutRecherche
                );
            }
        }
    }

    /**
     * Retourne la classe CSS appropriée pour le badge de statut.
     * Transforme 'En Cours' en 'en-cours'.
     * @param statut Le statut du litige.
     * @returns La chaîne de caractères de la classe CSS.
     */
    getStatutClass(statut: Litige['statut']): string {
        return statut.toLowerCase().replace(' ', '-');
    }

    /**
     * Gère l'action "Voir Détails" pour un litige spécifique.
     * @param litige L'objet Litige concerné.
     */
    voirDetails(litige: Litige): void {
        this.router.navigate(['/litiges/detail/', litige.no]);
        // Implémentez ici la navigation ou l'ouverture d'une modale
    }
}
