import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Env } from '../env';
import { AuthResponse } from './grand-interface';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Clé pour stocker le jeton dans le stockage local

  header!:HttpHeaders ;

  constructor(private http:HttpClient) {
    this.header = new HttpHeaders();
    this.header.append('Content-Type', 'application/json');
    this.header.append('Accept', 'application/json');
    this.header.append('Access-Control-Allow-Origin', '*');
    this.header.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }

  static tokenKey: string = "token" ;

  login(data:any) {
    return this.http.post<AuthResponse>(Env.LOGIN, data, { headers: this.header });
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token != null;
  }

  // Récupère le jeton stocké
  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Stocke le jeton après la connexion
  static saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Supprime le jeton lors de la déconnexion
  static logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
