import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../app/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API = 'http://localhost:8080/api/campusflow/usuarios';

  constructor(private http: HttpClient) {}
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API);
  }
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, usuario);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`);
  }
}
