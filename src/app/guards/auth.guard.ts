// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        // Verificar si el usuario está autenticado
        if (!this.authService.isAuthenticated()) {
            console.log('Usuario no autenticado, redirigiendo a login');
            this.router.navigate(['/login']);
            return false;
        }

        // Verificar roles si están definidos en la ruta
        const expectedRoles = route.data['roles'] as string[];
        if (expectedRoles && expectedRoles.length > 0) {
            const userRole = this.authService.getUserRole();

            if (!userRole || !expectedRoles.includes(userRole)) {
                console.log(`Acceso denegado. Rol del usuario: ${userRole}, Roles esperados: ${expectedRoles}`);
                this.router.navigate(['/error-carga']);
                return false;
            }
        }

        return true;
    }
}

// src/app/guards/role.guard.ts
@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        const userRole = this.authService.getUserRole();
        const expectedRoles = route.data['roles'] as string[];

        if (!userRole) {
            this.router.navigate(['/login']);
            return false;
        }

        if (expectedRoles && !expectedRoles.includes(userRole)) {
            // Redirigir según el rol del usuario
            if (userRole === 'ROLE_ESTUDIANTE') {
                this.router.navigate(['/dashboard-estudiante']);
            } else if (userRole === 'ROLE_PROFESOR') {
                this.router.navigate(['/dashboard-profesor']);
            } else {
                this.router.navigate(['/login']);
            }
            return false;
        }

        return true;
    }
}