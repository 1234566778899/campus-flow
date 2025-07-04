import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carrera } from '../model/carrera';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private apiUrl = 'http://localhost:8080'
  constructor(private http: HttpClient) { }

  getAllCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carrera`).pipe(
      catchError(error => {
        console.error('Error al obtener carreras:', error);
        return throwError(() => new Error('Error al cargar las carreras.'));
      })
    );
  }
}
