import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'; // 💡 Importez Router, NavigationEnd
import { filter } from 'rxjs/operators';
// Importez le composant de la barre latérale
import { SidebarComponent } from './components/ui/sidebar/sidebar';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  // Implémentez OnInit
  protected readonly title = signal('tji_teliman_web');

  // Signal pour contrôler si la barre latérale doit être visible
  protected showSidebar = signal(true);

  // Injectez le service Router
  constructor(private router: Router) {}

  ngOnInit() {

    // // Abonnement aux événements de navigation
    // this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
    //   const url = (event as NavigationEnd).urlAfterRedirects;

    //   // Liste des chemins où la sidebar DOIT ÊTRE CACHÉE
    //   // Ajoutez ici toutes les "pages" où vous ne voulez pas la sidebar (ex: login, inscription, 404, etc.)
    //   const routesToHideSidebar = ['/login'];

    //   // Mettre à jour le signal : cacher la sidebar si l'URL courante est dans la liste.
    //   this.showSidebar.set(!routesToHideSidebar.includes(url));

    //   console.log(`Navigation vers: ${url}. Sidebar visible: ${this.showSidebar()}`);
    // });
    
  }
}
