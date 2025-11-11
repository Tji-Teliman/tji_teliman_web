
export class GrandInterface {
  
}
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  message: string;
  code: number;
  data:any;
}
