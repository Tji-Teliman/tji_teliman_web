import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router'; // Importez RouterOutlet ici (et Router)

@Component({
  selector: 'app-login',
  // Ajout de RouterOutlet aux imports pour résoudre l'erreur du Router
  imports: [CommonModule, RouterOutlet],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  // 1. Logique de l'icône d'œil (utilisée dans login.html)
  showPassword = signal(false);

  // 2. Injection du Router pour la navigation
  constructor(private router: Router) {}

  // Fonction appelée par le clic sur l'icône d'œil
  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  // 3. Fonction appelée par la soumission du formulaire (submit)
  onLogin() {
    // NOTE : Normalement, ici, vous vérifieriez l'email et le mot de passe
    // contre un service d'authentification.

    console.log("Connexion réussie simulée. Redirection vers le tableau de bord.");

    // Redirige l'utilisateur vers la route '/dashboard'
    this.router.navigate(['/dashboard']);
  }
}
