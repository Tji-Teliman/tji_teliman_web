import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-header', // Le sélecteur que vous utiliserez dans vos autres pages
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  
  // Variable pour le terme de recherche bidirectionnel (ngModel)
  public searchTerm: string = '';

  // Événement émis lorsque le terme de recherche change
  @Output() searchChange = new EventEmitter<string>();

  ngOnInit(): void {
    // Vous pouvez observer les changements de searchTerm ici si nécessaire
    // Mais dans ce cas précis, ngModel gère l'état et l'on peut ajouter une méthode 
    // pour déclencher l'output si l'on voulait plus de contrôle (ex: onKeyUp)
  }

  // Optionnel : Une méthode si vous vouliez émettre l'événement de manière contrôlée
  /*
  onSearch() {
    this.searchChange.emit(this.searchTerm);
  }
  */
}