import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GrupoForo } from '../model/grupoForo';

@Injectable({
  providedIn: 'root'
})
export class GrupoForoService {
  private apiUrl = `${environment.apiUrl}/grupoForo`; // Corregido según el controller

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene la lista de todos los grupos de foro activos.
   */
  getGruposForo(): Observable<GrupoForo[]> {
    return this.http.get<GrupoForo[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un grupo de foro por su ID.
   */
  getGrupoForoById(id: number): Observable<GrupoForo> {
    return this.http.get<GrupoForo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo grupo de foro.
   */
  createGrupoForo(grupoForo: GrupoForo): Observable<GrupoForo> {
    return this.http.post<GrupoForo>(this.apiUrl, grupoForo, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un grupo de foro existente.
   */
  updateGrupoForo(id: number, grupoForo: GrupoForo): Observable<GrupoForo> {
    return this.http.put<GrupoForo>(`${this.apiUrl}/${id}`, grupoForo, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente un grupo de foro.
   */
  deleteGrupoForo(id: number): Observable<GrupoForo> {
    return this.http.delete<GrupoForo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en GrupoForoService.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en GrupoForoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}