import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Estudiante } from '../model/estudiante';
import { RegisterEstudiantePayload } from '../model/RegisterEstudiantePayload';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = environment.apiUrl; // La URL base de tu backend

  constructor(private http: HttpClient) { }

  /**
    * Envía los datos de registro de un nuevo estudiante al backend.
    * @param payload Los datos del formulario de registro.
    * @returns Un Observable con el EstudianteDTO del estudiante registrado.
    */
  registerEstudiante(payload: RegisterEstudiantePayload): Observable<Estudiante> { // Asegúrate de que el tipo de retorno sea EstudianteDTO
    return this.http.post<Estudiante>(`${this.apiUrl}/estudiantes/register`, payload).pipe( // Ruta ajustada a '/estudiantes/register'
      catchError(this.handleError)
    );
  }
  /**
   * Obtiene los detalles de un estudiante por el ID de su usuario asociado.
   * Este es el método clave para obtener el IdEstudiante del usuario logueado.
   * @param idUsuario El ID del usuario.
   * @returns Un Observable con el objeto EstudianteDTO.
   */
  getEstudianteByUserId(idUsuario: number): Observable<Estudiante> {
    // Se ha actualizado la ruta para que coincida con el nuevo endpoint del backend
    return this.http.get<Estudiante>(`${this.apiUrl}/estudiante/busca-por-usuario/${idUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en EstudianteService.';
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
    console.error('Error en EstudianteService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene todos los estudiantes
   */
  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un estudiante por ID
   */
  getEstudianteById(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene estudiantes por asignatura
   */
  getEstudiantesByAsignatura(idAsignatura: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/asignatura/${idAsignatura}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }


}
