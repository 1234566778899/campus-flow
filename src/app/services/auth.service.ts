// src/app/services/auth.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthRequest, AuthResponse } from '../model/Auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario';
import { RegisterEstudiantePayload } from '../model/RegisterEstudiantePayload';
import { Estudiante } from '../model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_API_URL}/auth/login`, authRequest).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('user_role', response.role);
        localStorage.setItem('user_id', response.userId.toString());
        if (response.role === 'ROLE_ESTUDIANTE') {
          this.router.navigate(['/dashboard-estudiante']);

        } else if (response.role === 'ROLE_PROFESOR') {
          this.router.navigate(['/dashboard-profesor']);
        } else {
          this.router.navigate(['/default-dashboard']);
        }
      }),
      catchError(this.handleError)
    );
  }

  registerEstudiante(payload: RegisterEstudiantePayload): Observable<any> {
    const usuarioDTO: Usuario = {
      nombre: payload.nombre,
      apellido: payload.apellido,
      email: payload.email,
      username: payload.username,
      password: payload.password,
      rolId: 2,
      Estado: true
    };

    return this.http.post<Usuario>(`${this.BASE_API_URL}/usuarios`, usuarioDTO).pipe(
      switchMap(responseUsuario => {
        if (!responseUsuario.idUsuario) {
          return throwError(() => new Error('El backend no devolvió el ID del usuario creado.'));
        }

        const estudianteDTO: Estudiante = {
          IdEstudiante: 0,
          Ciclo: payload.ciclo,
          idCarrera: payload.idCarrera,
          idUsuario: responseUsuario.idUsuario,
          Estado: true
        };
        return this.http.post<Estudiante>(`${this.BASE_API_URL}/estudiante`, estudianteDTO);
      }),
      catchError(this.handleError)
    );
  }



  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? +userId : null;
  }

  // src/app/services/auth.service.ts - Método getUserDetails con headers explícitos
  getUserDetails(userId: number): Observable<Usuario> {
    const token = this.getToken();

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };


    return this.http.get<Usuario>(`${this.BASE_API_URL}/usuarios/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('❌ Error en getUserDetails:', error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 409) {
        errorMessage = 'El usuario o email ya están registrados.';
      } else if (error.status === 400) {
        errorMessage = 'Datos de solicitud inválidos. Verifique la información.';
      } else if (error.status === 401) {
        errorMessage = 'Acceso no autorizado. Credenciales inválidas o token expirado.';
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
  // src/app/services/auth.service.ts - Método getToken() mejorado
  getToken(): string | null {
    const token = localStorage.getItem('jwt_token');
    return token;
  }


}
