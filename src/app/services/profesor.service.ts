import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterProfesorPayload } from '../model/RegisterProfesorPayload';
import { Profesor } from '../model/profesor';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'http://localhost:8080'; // La URL base de tu backend

  constructor(private http: HttpClient) { }
  
  /**
   * Envía los datos de registro de un nuevo profesor al backend.
   * @param payload Los datos del formulario de registro.
   * @returns Un Observable con el ProfesorDTO del profesor registrado.
   */
  registerProfesor(payload: RegisterProfesorPayload): Observable<Profesor> {
    return this.http.post<Profesor>(`${this.apiUrl}/profesor/register`, payload).pipe(
      catchError(error => {
        console.error('Error al registrar profesor:', error);
        let errorMessage = 'Error al registrar el profesor. Inténtelo de nuevo.';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
