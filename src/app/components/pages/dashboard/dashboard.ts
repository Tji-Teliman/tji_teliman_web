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
    { title: 'Total Utilisateurs', value: '1.333', color: '#2563EB', iconClass: 'fa-users' },
    { title: 'Total Recruteurs', value: '378', color: '#10B981', iconClass: 'fa-user-tie' },
    { title: 'Total Jeunes Prest.', value: '700', color: '#F59E0B', iconClass: 'fa-user-check' },
    { title: 'Total Missions', value: '420', color: '#000000', iconClass: 'fa-location-arrow' },
  ];

  constructor(private data:Data) {}

  ngOnInit(): void {
    this.data.getData(Env.STATISTIQUE).subscribe(
      {
        next: (res:any)=>{
          console.log(res);
        },
        error : (err)=>{
          console.log(err);
        }
      }
    )
  }
}
