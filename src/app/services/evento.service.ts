import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../model/evento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/evento`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento, { headers: this.getHeaders() });
  }

  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento, { headers: this.getHeaders() });
  }

  deleteEvento(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getEventosByProfesorId(idProfesor: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/profesor/${idProfesor}`, { headers: this.getHeaders() });
  }

  getProximos5EventosDeEstudiante(idEstudiante: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/estudiante/${idEstudiante}/proximos`, { headers: this.getHeaders() });
  }

  getTop3EventosMasParticipacion(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/top3-participacion`, { headers: this.getHeaders() });
  }

  getEventosByCarreraId(idCarrera: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/carrera/${idCarrera}`, { headers: this.getHeaders() });
  }

  unirseAEvento(idEvento: number, idEstudiante: number): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/${idEvento}/unirse/${idEstudiante}`, {}, { headers: this.getHeaders() });
  }
}