import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Data } from '../../../services/data';
import { Env } from '../../../env';

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
    { title: 'Total Utilisateurs', value: '0', color: '#2563EB', iconClass: 'fa-users' },
    { title: 'Total Recruteurs', value: '0', color: '#10B981', iconClass: 'fa-user-tie' },
    { title: 'Total Jeunes Prest.', value: '0', color: '#F59E0B', iconClass: 'fa-user-check' },
    { title: 'Total Missions', value: '0', color: '#000000', iconClass: 'fa-location-arrow' },
  ];
totalUtilisateur: any;
totalRecruteur: any;

  constructor(private data:Data) {}

  ngOnInit(): void {
    this.data.getData(Env.STATISTIQUE).subscribe(
      {
        next: (res:any)=>{
          this.stats[0].value = res.totalUtilisateurs;
          this.stats[1].value = res.totalRecruteurs;
          this.stats[2].value = res.totalJeunes;
          this.stats[3].value = res.totalMissionsPubliees;
          console.log(res);
        },
        error : (err)=>{
          console.log(err);
        }
      }
    )
  }
}
