import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router: Router = inject(Router);

  return authService.isAuth().pipe(
    tap(isLogged => {
      if (!isLogged) {       
        router.navigate(['/login']);
      } 
    })
  )
};
