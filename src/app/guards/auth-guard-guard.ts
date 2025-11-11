import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { faL } from '@fortawesome/free-solid-svg-icons';

export const authGuard: CanActivateFn = (route, state) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const isAuthenticated = Auth.isAuthenticated();
    const route = inject(Router);

    if (!isAuthenticated) {
      route.navigateByUrl('login');
      return false;
    }
  }
  return true;
};
