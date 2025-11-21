import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class AdminOnlyGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAdmin()) return true;
    this.router.navigate(['/home']);
    return false;
  }
}

/**
 * Alias em PT-BR para usar no app.routes.ts
 * GuardaRotasAdmin e AdminOnlyGuard são o MESMO guard.
 */
export { AdminOnlyGuard as GuardaRotasAdmin };
