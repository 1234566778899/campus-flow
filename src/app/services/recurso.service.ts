import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recurso } from '../model/recurso';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private apiUrl = `${environment.apiUrl}/recurso`; // Ajusta la ruta de tu API para Recurso

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los recursos activos.
   * @returns Un Observable con un array de RecursoDTO.
   */
  getRecursos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un recurso por su ID.
   * @param id El ID del recurso.
   * @returns Un Observable con el RecursoDTO.
   */
  getRecursoById(id: number): Observable<Recurso> {
    return this.http.get<Recurso>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo recurso.
   * @param recurso El RecursoDTO a crear.
   * @returns Un Observable con el RecursoDTO creado.
   */
  createRecurso(recurso: Recurso): Observable<Recurso> {
    return this.http.post<Recurso>(this.apiUrl, recurso).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un recurso existente.
   * @param id El ID del recurso a actualizar.
   * @param recurso Los datos actualizados del RecursoDTO.
   * @returns Un Observable con el RecursoDTO actualizado.
   */
  updateRecurso(id: number, recurso: Recurso): Observable<Recurso> {
    return this.http.put<Recurso>(`${this.apiUrl}/${id}`, recurso).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente un recurso.
   * @param id El ID del recurso a eliminar.
   * @returns Un Observable con el RecursoDTO eliminado (lógicamente).
   */
  deleteRecurso(id: number): Observable<Recurso> {
    return this.http.delete<Recurso>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error El error HTTP.
   * @returns Un Observable con un error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en RecursoService.';
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
    console.error('Error en RecursoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
