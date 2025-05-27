import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verificar si estamos en el navegador (cliente)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (!token) {
      router.navigate(['/']);
      return false;
    }

    return true;
  }

  // Si no es en el navegador (por ejemplo, SSR), bloquear
  return false;
};
