// src/app/app.ts

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 💡 Importez la SidebarComponent
import { SidebarComponent } from './components/ui/sidebar/sidebar';

@Component({
  selector: 'app-root',
  // Ajoutez SidebarComponent aux imports pour qu'il soit utilisable dans le template
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('tji_teliman_web');
}
