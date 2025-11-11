import { AuthResponse } from "../services/grand-interface";


export interface LoginResponse {
  user: AuthResponse;
  token: string; // Le JWT
}
