export interface Alert {
  id: number;
  title: string;
  description: string;
  isSeen: boolean; // true si l'alerte a été traitée par l'admin
  advertisementId: number; // ID de l'annonce signalée (0 si c'est une alerte utilisateur générale)
}