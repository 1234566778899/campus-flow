import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarea } from '../model/tarea';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  // Corregida la URL para coincidir con el controller
  private API = 'http://localhost:8080/api/campusflow/tareas';

  constructor(private http: HttpClient) { }

  // Listar todas las tareas
  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.API);
  }

  // Registrar nueva tarea
  registrar(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.API, tarea);
  }

  // Modificar tarea existente
  modificar(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.API}/${id}`, tarea);
  }

  // Eliminar tarea (eliminación lógica)
  eliminar(id: number): Observable<Tarea> {
    return this.http.delete<Tarea>(`${this.API}/${id}`);
  }

  // Obtener tarea por ID
  obtenerPorId(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.API}/${id}`);
  }

  // Obtener tareas activas por estudiante
  obtenerTareasActivasPorEstudiante(idEstudiante: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.API}/estudiante/${idEstudiante}/activas`);
  }

  // Obtener tareas por prioridad
  obtenerTareasPorPrioridad(prioridad: string): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.API}/prioridad/${prioridad}`);
  }
}