import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Evento } from '../../../model/evento';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EstudianteService } from '../../../services/estudiante.service';
import { EventoService } from '../../../services/evento.service';
import { Estudiante } from '../../../model/estudiante';

@Component({
  selector: 'app-evento-listar',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './evento-listar.component.html',
  styleUrl: './evento-listar.component.css',
})
export class EventoListarComponent implements OnInit {
  eventos: Evento[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['nombre', 'fechaInicio', 'fechaFin', 'descripcion', 'puntajeRecompensa', 'acciones'];
  currentStudentId: number | null = null;
  currentStudentCarreraId: number | null = null;

  // Getter para calcular el total de puntos
  get totalPuntos(): number {
    return this.eventos.reduce((sum, evento) => sum + evento.PuntajeRecompensa, 0);
  }

  // Método para obtener el delay de animación
  getAnimationDelay(index: number): string {
    return (index * 0.1) + 's';
  }

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentStudentId = this.authService.getUserId();

    if (this.currentStudentId) {
      this.estudianteService.getEstudianteByUserId(this.currentStudentId).subscribe({
        next: (estudiante: Estudiante) => {
          this.currentStudentCarreraId = estudiante.idCarrera;
          if (this.currentStudentCarreraId) {
            this.loadEventosPorCarrera(this.currentStudentCarreraId);
          } else {
            this.snackBar.open('No se pudo obtener la carrera del estudiante.', 'Cerrar', { duration: 3000 });
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error al obtener datos del estudiante:', err);
          this.snackBar.open('Error al cargar datos del estudiante: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      });
    } else {
      this.snackBar.open('ID de estudiante no disponible. Por favor, inicie sesión.', 'Cerrar', { duration: 5000 });
      this.isLoading = false;
      this.router.navigate(['/login']); // Redirigir al login si no hay ID de estudiante
    }
  }

  /**
   * Carga los eventos relevantes para la carrera del estudiante.
   * @param idCarrera El ID de la carrera del estudiante.
   */
  loadEventosPorCarrera(idCarrera: number): void {
    this.isLoading = true;
    this.eventoService.getEventosByCarreraId(idCarrera).subscribe({
      next: (data: Evento[]) => {
        this.eventos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los eventos por carrera:', err);
        this.snackBar.open('Error al cargar los eventos: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  /**
   * Permite a un estudiante unirse a un evento.
   * @param idEvento El ID del evento al que unirse.
   */
  unirseAEvento(idEvento: number | undefined): void {
    if (idEvento && this.currentStudentId) {
      this.eventoService.joinEvento(idEvento, this.currentStudentId).subscribe({
        next: (response: Evento) => {
          this.snackBar.open('Te has unido al evento "' + response.Nombre + '" exitosamente!', 'Cerrar', { duration: 3000 });
          // Opcional: Recargar la lista de eventos para reflejar el cambio
          if (this.currentStudentCarreraId) {
            this.loadEventosPorCarrera(this.currentStudentCarreraId);
          }
        },
        error: (err) => {
          console.error('Error al unirse al evento:', err);
          this.snackBar.open('Error al unirse al evento: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('No se pudo unir al evento. ID de evento o estudiante no disponible.', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Navega de regreso al dashboard del estudiante.
   */
  goBackToDashboard(): void {
    this.router.navigate(['/dashboard-profesor']);
  }
}