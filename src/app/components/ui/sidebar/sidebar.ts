import { Component, OnInit } from '@angular/core';
// Importez les modules nécessaires ici
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ESSENTIEL pour routerLink et routerLinkActive

@Component({
  selector: 'app-sidebar',
  // MARQUEZ LE COMPOSANT COMME STANDALONE
  standalone: true,
  // IMPORTEZ LES DÉPENDANCES DIRECTEMENT
  imports: [
    CommonModule,
    RouterModule, // Permet d'utiliser les fonctionnalités de routage dans le template
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
