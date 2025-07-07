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
import { EventoService } from '../../../services/evento.service';

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

  // Getter para calcular el total de puntos
  get totalPuntos(): number {
    return this.eventos.reduce((sum, evento) => sum + (evento.puntajeRecompensa || 0), 0);
  }

  // Método para obtener el delay de animación
  getAnimationDelay(index: number): string {
    return (index * 0.1) + 's';
  }

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentStudentId = this.authService.getUserId();

    if (this.currentStudentId) {
      this.loadEventos();
    } else {
      this.mostrarError('ID de estudiante no disponible. Por favor, inicie sesión.');
      this.router.navigate(['/login']);
    }
  }

  /**
   * Carga todos los eventos disponibles o los eventos del estudiante.
   * Opción 1: Cargar todos los eventos activos
   * Opción 2: Usar el método getProximos5EventosDeEstudiante del backend
   * Opción 3: Asumir un idCarrera fijo o configurado
   */
  loadEventos(): void {
    this.isLoading = true;

    // Opción 1: Cargar todos los eventos y filtrar activos
    this.eventoService.getEventos().subscribe({
      next: (data: Evento[]) => {
        console.log('Eventos cargados:', data);
        // Filtrar solo eventos activos y válidos
        this.eventos = data;
        this.isLoading = false;

        if (this.eventos.length === 0) {
          this.mostrarInfo('No hay eventos activos disponibles en este momento.');
        }
      },
      error: (err) => {
        console.error('Error al cargar los eventos:', err);
        this.mostrarError('Error al cargar los eventos: ' + this.getErrorMessage(err));
        this.eventos = [];
        this.isLoading = false;
      }
    });

    /* 
    // Opción 2: Si prefieres usar el método específico para estudiantes
    // (necesitarías que el backend tenga un método que devuelva TODOS los eventos del estudiante)
    if (this.currentStudentId) {
      this.eventoService.getProximos5EventosDeEstudiante(this.currentStudentId).subscribe({
        next: (data: Evento[]) => {
          this.eventos = data || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar los eventos del estudiante:', err);
          this.mostrarError('Error al cargar los eventos: ' + this.getErrorMessage(err));
          this.eventos = [];
          this.isLoading = false;
        }
      });
    }
    */

    /* 
    // Opción 3: Si tienes un idCarrera configurado o asumes uno
    const idCarreraPredeterminada = 1; // O obtenerlo de configuración
    this.eventoService.getEventosByCarreraId(idCarreraPredeterminada).subscribe({
      next: (data: Evento[]) => {
        this.eventos = (data || []).filter(evento => 
          evento && evento.estado === true
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los eventos por carrera:', err);
        this.mostrarError('Error al cargar los eventos: ' + this.getErrorMessage(err));
        this.eventos = [];
        this.isLoading = false;
      }
    });
    */
  }

  /**
   * Verifica si un evento está disponible para el estudiante
   * Puedes personalizar esta lógica según tus necesidades
   */
  private isEventoDisponible(evento: Evento): boolean {
    // Verificar que el evento no haya pasado
    if (evento.fechaFin) {
      const fechaFin = new Date(evento.fechaFin);
      const hoy = new Date();
      if (fechaFin < hoy) {
        return false; // Evento ya terminado
      }
    }

    // Aquí puedes agregar más lógica, como:
    // - Verificar si el estudiante ya está inscrito
    // - Verificar requisitos específicos
    // - Filtrar por carrera si tienes esa información

    return true;
  }

  /**
   * Permite a un estudiante unirse a un evento.
   * @param evento El evento al que unirse.
   */
  unirseAEvento(evento: Evento): void {
    if (!evento.idEvento || !this.currentStudentId) {
      this.mostrarError('No se pudo unir al evento. Datos incompletos.');
      return;
    }

    // Verificar que el evento esté activo
    if (!evento.estado) {
      this.mostrarError('Este evento no está disponible.');
      return;
    }

    this.eventoService.unirseAEvento(evento.idEvento, this.currentStudentId).subscribe({
      next: (response: Evento) => {
        this.mostrarExito(`Te has unido al evento "${response.nombre || evento.nombre}" exitosamente!`);
        // Recargar la lista de eventos para reflejar el cambio
        this.loadEventos();
      },
      error: (err) => {
        console.error('Error al unirse al evento:', err);
        const mensaje = this.getErrorMessage(err);
        this.mostrarError('Error al unirse al evento: ' + mensaje);
      }
    });
  }

  /**
   * Verifica si el evento está próximo (dentro de los próximos 7 días)
   */
  isEventoProximo(fechaInicio: string): boolean {
    if (!fechaInicio) return false;

    try {
      const hoy = new Date();
      const fechaEvento = new Date(fechaInicio);
      const diferenciaDias = Math.ceil((fechaEvento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
      return diferenciaDias >= 0 && diferenciaDias <= 7;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si el evento es hoy
   */
  isEventoHoy(fechaInicio: string): boolean {
    if (!fechaInicio) return false;

    try {
      const hoy = new Date();
      const fechaEvento = new Date(fechaInicio);
      return hoy.toDateString() === fechaEvento.toDateString();
    } catch (error) {
      return false;
    }
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificada';

    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  /**
   * Navega de regreso al dashboard del estudiante.
   */
  goBackToDashboard(): void {
    this.router.navigate(['/dashboard-estudiante']);
  }

  /**
   * Extrae información adicional de la descripción
   */
  extractModalidadFromDescription(descripcion: string): string {
    if (!descripcion) return 'No especificada';
    const modalidadMatch = descripcion.match(/Modalidad:\s*(\w+)/i);
    return modalidadMatch ? modalidadMatch[1] : 'No especificada';
  }

  extractUbicacionFromDescription(descripcion: string): string {
    if (!descripcion) return 'No especificada';
    const ubicacionMatch = descripcion.match(/Ubicación:\s*([^\n]+)/i);
    return ubicacionMatch ? ubicacionMatch[1].trim() : 'No especificada';
  }

  /**
   * Obtiene un mensaje de error legible
   */
  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Error desconocido';
  }

  /**
   * Muestra mensajes de éxito
   */
  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra mensajes de error
   */
  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Muestra mensajes informativos
   */
  private mostrarInfo(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      panelClass: ['info-snackbar']
    });
  }
}