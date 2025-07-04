import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GrupoForo } from '../model/grupoForo';

@Injectable({
  providedIn: 'root'
})
export class GrupoForoService {
  private apiUrl = `${environment.apiUrl}/grupo-foro`; // Ajusta la ruta de tu API para GrupoForo

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los grupos de foro activos.
   * @returns Un Observable con un array de GrupoForoDTO.
   */
  getGruposForo(): Observable<GrupoForo[]> {
    // Asumimos que el backend ya está devolviendo 'nombreAsignatura' en el DTO
    return this.http.get<GrupoForo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un grupo de foro por su ID.
   * @param id El ID del grupo de foro.
   * @returns Un Observable con el GrupoForoDTO.
   */
  getGrupoForoById(id: number): Observable<GrupoForo> {
    return this.http.get<GrupoForo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo grupo de foro.
   * @param grupoForo El GrupoForoDTO a crear.
   * @returns Un Observable con el GrupoForoDTO creado.
   */
  createGrupoForo(grupoForo: GrupoForo): Observable<GrupoForo> {
    return this.http.post<GrupoForo>(this.apiUrl, grupoForo).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un grupo de foro existente.
   * @param id El ID del grupo de foro a actualizar.
   * @param grupoForo Los datos actualizados del GrupoForoDTO.
   * @returns Un Observable con el GrupoForoDTO actualizado.
   */
  updateGrupoForo(id: number, grupoForo: GrupoForo): Observable<GrupoForo> {
    return this.http.put<GrupoForo>(`${this.apiUrl}/${id}`, grupoForo).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente un grupo de foro.
   * @param id El ID del grupo de foro a eliminar.
   * @returns Un Observable con el GrupoForoDTO eliminado (lógicamente).
   */
  deleteGrupoForo(id: number): Observable<GrupoForo> {
    return this.http.delete<GrupoForo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error El error HTTP.
   * @returns Un Observable con un error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en GrupoForoService.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (typeof error.error === 'string') {
        errorMessage = error.error; // Si el backend envía un mensaje de error simple
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message; // Si el backend envía un objeto con una propiedad 'message'
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en GrupoForoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}