// src/app/services/nota.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Nota } from '../model/nota';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = `${environment.apiUrl}/nota`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene todas las notas
   */
  getNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene las notas de un estudiante específico
   */
  getNotasByEstudianteId(idEstudiante: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/estudiante/${idEstudiante}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene las notas de una asignatura específica
   */
  getNotasByAsignaturaId(idAsignatura: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/asignatura/${idAsignatura}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene las notas de un estudiante en un rango de puntaje
   */
  getNotasByEstudianteYRango(idEstudiante: number, puntajeMinimo: number, puntajeMaximo: number): Observable<Nota[]> {
    const params = `?puntajeMinimo=${puntajeMinimo}&puntajeMaximo=${puntajeMaximo}`;
    return this.http.get<Nota[]>(`${this.apiUrl}/estudiante/${idEstudiante}/rango${params}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva nota
   */
  createNota(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl, nota, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una nota existente
   */
  updateNota(id: number, nota: Nota): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/${id}`, nota, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente una nota
   */
  deleteNota(id: number): Observable<Nota> {
    return this.http.delete<Nota>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en NotaService.';
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
    console.error('Error en NotaService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}