// src/app/components/pages/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour les directives Angular standard
import { RouterLink } from '@angular/router'; // Si vous avez des liens internes

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  adminName: string = 'Amadou Bagayoko';

  stats = [
    { title: 'Total Utilisateurs', value: '1.333', color: '#2563EB', iconClass: 'fa-users' },
    { title: 'Total Recruteurs', value: '378', color: '#10B981', iconClass: 'fa-user-tie' },
    { title: 'Total Jeunes Prest.', value: '700', color: '#F59E0B', iconClass: 'fa-user-check' },
    { title: 'Total Missions', value: '420', color: '#000000', iconClass: 'fa-location-arrow' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
