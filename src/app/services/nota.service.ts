import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Nota } from '../model/nota';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotasByEstudianteId(idEstudiante: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/estudiantes/${idEstudiante}/notas`).pipe(
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
