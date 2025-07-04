import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Evento } from '../model/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/evento`; // Ajusta la ruta de tu API para Evento

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los eventos activos.
   * @returns Un Observable con un array de EventoDTO.
   */
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un evento por su ID.
   * @param id El ID del evento.
   * @returns Un Observable con el EventoDTO.
   */
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo evento.
   * @param evento El EventoDTO a crear.
   * @returns Un Observable con el EventoDTO creado.
   */
  createEvento(evento: Event): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un evento existente.
   * @param id El ID del evento a actualizar.
   * @param evento El EventoDTO con los datos actualizados.
   * @returns Un Observable con el EventoDTO actualizado.
   */
  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente un evento.
   * @param id El ID del evento a eliminar.
   * @returns Un Observable con el EventoDTO eliminado (lógicamente).
   */
  deleteEvento(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene eventos por el ID de un profesor.
   * @param idProfesor El ID del profesor.
   * @returns Un Observable con un array de EventoDTO.
   */
  getEventosByProfesorId(idProfesor: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/profesor/${idProfesor}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene los próximos 5 eventos de un estudiante.
   * @param idEstudiante El ID del estudiante.
   * @returns Un Observable con un array de EventoDTO.
   */
  getProximos5EventosDeEstudiante(idEstudiante: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/estudiante/${idEstudiante}/proximos`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Nuevo método: Obtiene eventos por el ID de la carrera del profesor.
   * @param idCarrera El ID de la carrera.
   * @returns Un Observable con un array de EventoDTO.
   */
  getEventosByCarreraId(idCarrera: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/carrera/${idCarrera}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Nuevo método: Permite a un estudiante unirse a un evento.
   * @param idEvento El ID del evento al que unirse.
   * @param idEstudiante El ID del estudiante que se une.
   * @returns Un Observable con el EventoDTO actualizado.
   */
  joinEvento(idEvento: number, idEstudiante: number): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/${idEvento}/unirse/${idEstudiante}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en EventoService.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en EventoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}