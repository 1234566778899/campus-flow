import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../model/evento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/evento`; // Asegúrate que coincida con tu backend

  constructor(private http: HttpClient) { }

  // Método privado para obtener los headers con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Listar todos los eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtener evento por ID
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crear nuevo evento
  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento, { headers: this.getHeaders() });
  }

  // Actualizar evento existente
  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento, { headers: this.getHeaders() });
  }

  // Eliminar lógicamente un evento
  deleteEvento(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtener eventos por profesor
  getEventosByProfesorId(idProfesor: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/profesor/${idProfesor}`, { headers: this.getHeaders() });
  }

  // Obtener próximos eventos de estudiante
  getProximos5EventosDeEstudiante(idEstudiante: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/estudiante/${idEstudiante}/proximos`, { headers: this.getHeaders() });
  }

  // Obtener eventos por carrera
  getEventosByCarreraId(idCarrera: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/carrera/${idCarrera}`, { headers: this.getHeaders() });
  }

  // Unir estudiante a evento
  joinEvento(idEvento: number, idEstudiante: number): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/${idEvento}/unirse/${idEstudiante}`, {}, { headers: this.getHeaders() });
  }
}