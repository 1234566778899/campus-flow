// src/app/interceptors/interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Interceptor: Interceptando petición a:', request.url); // Log de inicio del interceptor
    const token = this.authService.getToken(); // Obtiene el token del AuthService

    if (token) {
      console.log('Interceptor: Token encontrado. Añadiendo cabecera Authorization.'); // Log si encuentra token
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('Interceptor: No se encontró token en localStorage para la petición:', request.url); // Log si no encuentra token
    }

    return next.handle(request);
  }
}
