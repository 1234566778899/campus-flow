import { Injectable } from '@angular/core';
import { Publicacion } from '../model/publicacion';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/publicacion`; // Ajusta la ruta de tu API para Publicacion

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todas las publicaciones activas.
   * @returns Un Observable con un array de PublicacionDTO.
   */
  getPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una publicación por su ID.
   * @param id El ID de la publicación.
   * @returns Un Observable con la PublicacionDTO.
   */
  getPublicacionById(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva publicación.
   * @param publicacion El PublicacionDTO a crear.
   * @returns Un Observable con la PublicacionDTO creada.
   */
  createPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.apiUrl, publicacion).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una publicación existente.
   * @param id El ID de la publicación a actualizar.
   * @param publicacion Los datos actualizados de la PublicacionDTO.
   * @returns Un Observable con la PublicacionDTO actualizada.
   */
  updatePublicacion(id: number, publicacion: Publicacion): Observable<Publicacion> {
    return this.http.put<Publicacion>(`${this.apiUrl}/${id}`, publicacion).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente una publicación.
   * @param id El ID de la publicación a eliminar.
   * @returns Un Observable con la PublicacionDTO eliminada (lógicamente).
   */
  deletePublicacion(id: number): Observable<Publicacion> {
    return this.http.delete<Publicacion>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene publicaciones de un grupo de foro específico.
   * @param idGrupoForo El ID del grupo de foro.
   * @returns Un Observable con un array de PublicacionDTO.
   */
  getPublicacionesByGrupoForo(idGrupoForo: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/grupo-foro/${idGrupoForo}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene publicaciones de un grupo de foro con un label específico.
   * @param idGrupoForo El ID del grupo de foro.
   * @param label El label de la publicación.
   * @returns Un Observable con un array de PublicacionDTO.
   */
  getPublicacionesByGrupoForoAndLabel(idGrupoForo: number, label: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/grupo-foro/${idGrupoForo}/label/${label}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene publicaciones de un grupo de foro por fecha.
   * @param idGrupoForo El ID del grupo de foro.
   * @param fecha La fecha de la publicación (formato 'YYYY-MM-DD').
   * @returns Un Observable con un array de PublicacionDTO.
   */
  getPublicacionesByGrupoForoAndFecha(idGrupoForo: number, fecha: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/grupo-foro/${idGrupoForo}/fecha/${fecha}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error El error HTTP.
   * @returns Un Observable con un error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en PublicacionService.';
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
    console.error('Error en PublicacionService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}