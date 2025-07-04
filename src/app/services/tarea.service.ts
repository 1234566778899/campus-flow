import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarea } from '../model/tarea';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private API = 'http://localhost:8080/api/campusflow/tarea';

  constructor(private http: HttpClient) {}
  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.API);
  }
  registrar(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.API, tarea);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
  obtenerPorId(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.API}/${id}`);
  }
}
