import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Tarea } from '../../model/tarea';
import { TareaService } from '../../services/tarea.service';
// ✅ SOLO AGREGADO: Importaciones para eventos
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../model/evento';

interface EstadisticasEstudio {
  horasSemanales: number;
  horasHoy: number;
  metaSemanal: number;
  racha: number;
  horasPorDia: { dia: string; horas: number }[];
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent implements OnInit {
  fechaActual = new Date();
  diasDelCalendario: { dia: number | null, esHoy: boolean }[] = [];
  private hoy = new Date();
  tareasActivas: Tarea[] = [];
  tareas: Tarea[] = [];

  // ✅ SOLO AGREGADO: Propiedades para eventos dinámicos
  proximosEventos: Evento[] = [];
  isLoadingEventos = false;

  constructor(
    private tareaService: TareaService,
    private router: Router,
    // ✅ SOLO AGREGADO: Inyección del EventoService
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    this.generarCalendario();
    this.cargarEstadisticasEstudio();
    this.cargarTareas();
    // ✅ SOLO AGREGADO: Cargar eventos
    this.cargarProximosEventos();
  }

  navegarATareas(): void {
    this.router.navigate(['/dashboard-estudiante/tareas']);
  }

  // ✅ SOLO AGREGADO: Métodos para eventos dinámicos
  private cargarProximosEventos(): void {
    this.isLoadingEventos = true;
    this.eventoService.getEventos().subscribe({
      next: (data: Evento[]) => {
        this.proximosEventos = data.slice(0, 5);
        this.isLoadingEventos = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.proximosEventos = [];
        this.isLoadingEventos = false;
      }
    });
  }

  getDiaDelEvento(fechaInicio: string): number {
    return new Date(fechaInicio).getDate();
  }

  getHoraEvento(fechaInicio: string): string {
    return new Date(fechaInicio).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDescripcionCorta(descripcion: string): string {
    if (!descripcion) return 'Evento programado';
    return descripcion.length > 50 ? descripcion.substring(0, 50) + '...' : descripcion;
  }

  // Todo lo demás se mantiene igual...
  private cargarTareas(): void {
    this.tareaService.listar().subscribe(
      (data: Tarea[]) => {
        // Convertir fechaLimite a tipo Date
        this.tareas = data.map(t => ({
          ...t,
          fechaLimite: new Date(t.fechaLimite)
        }));
        console.log('Tareas cargadas:', this.tareas);
      },
      (error) => {
        console.error('Error al cargar tareas:', error);
      }
    );
  }

  estadisticasEstudio: EstadisticasEstudio = {
    horasSemanales: 0,
    horasHoy: 0,
    metaSemanal: 20,
    racha: 0,
    horasPorDia: []
  };

  // Datos de ejemplo para estadísticas de estudio
  private estadisticasEjemplo: EstadisticasEstudio = {
    horasSemanales: 15.5,
    horasHoy: 2.5,
    metaSemanal: 20,
    racha: 5,
    horasPorDia: [
      { dia: 'Lun', horas: 3.5 },
      { dia: 'Mar', horas: 2.0 },
      { dia: 'Mié', horas: 4.0 },
      { dia: 'Jue', horas: 1.5 },
      { dia: 'Vie', horas: 3.0 },
      { dia: 'Sáb', horas: 1.5 },
      { dia: 'Dom', horas: 0 }
    ]
  };

  private cargarEstadisticasEstudio(): void {
    this.estadisticasEstudio = this.estadisticasEjemplo;
  }

  getProgresoSemanal(): number {
    return Math.min(Math.round((this.estadisticasEstudio.horasSemanales / this.estadisticasEstudio.metaSemanal) * 100), 100);
  }

  getMensajeMotivacional(): string {
    const progreso = this.getProgresoSemanal();
    if (progreso >= 100) {
      return '¡Excelente! Has superado tu meta semanal 🎉';
    } else if (progreso >= 80) {
      return '¡Muy bien! Ya casi alcanzas tu meta 💪';
    } else if (progreso >= 50) {
      return 'Buen progreso, ¡sigue así! 📚';
    } else {
      return '¡Vamos! Aún puedes lograr tu meta 🚀';
    }
  }

  getMaxHorasDia(): number {
    return Math.max(...this.estadisticasEstudio.horasPorDia.map(d => d.horas), 1);
  }

  getAlturaBarra(horas: number): number {
    const maxHoras = this.getMaxHorasDia();
    return Math.max((horas / maxHoras) * 100, 5); // Mínimo 5% para visibilidad
  }

  getColorBarra(horas: number): string {
    if (horas === 0) return 'bg-gray-200';
    if (horas < 2) return 'bg-yellow-400';
    if (horas < 3) return 'bg-blue-400';
    return 'bg-green-400';
  }

  getHorasRestantes(): number {
    return Math.max(this.estadisticasEstudio.metaSemanal - this.estadisticasEstudio.horasSemanales, 0);
  }

  esDiaActual(dia: string): boolean {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = new Date();
    const diaHoy = diasSemana[hoy.getDay()];
    return dia === diaHoy;
  }

  private esFechaHoy(fecha: Date): boolean {
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear();
  }

  private esFechaManana(fecha: Date): boolean {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return fecha.getDate() === manana.getDate() &&
      fecha.getMonth() === manana.getMonth() &&
      fecha.getFullYear() === manana.getFullYear();
  }

  getEstadoTarea(tarea: Tarea): string {
    if (this.esFechaHoy(tarea.fechaLimite)) {
      return 'Vence hoy';
    } else if (this.esFechaManana(tarea.fechaLimite)) {
      return 'Vence mañana';
    } else {
      const diasRestantes = Math.ceil((tarea.fechaLimite.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (diasRestantes < 0) {
        return 'Vencida';
      } else if (diasRestantes === 0) {
        return 'Vence hoy';
      } else {
        return `${diasRestantes} días`;
      }
    }
  }

  getClaseEstadoTarea(tarea: Tarea): string {
    if (this.esFechaHoy(tarea.fechaLimite)) {
      return 'due-today';
    } else if (this.esFechaManana(tarea.fechaLimite)) {
      return 'due-tomorrow';
    } else {
      const diasRestantes = Math.ceil((tarea.fechaLimite.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return diasRestantes < 0 ? 'overdue' : 'due-later';
    }
  }

  getPrioridadIcon(prioridad: string): string {
    switch (prioridad) {
      case 'alta': return '🔥';
      case 'media': return '⚡';
      case 'baja': return '🌱';
      default: return '📝';
    }
  }

  private generarCalendario(): void {
    const anio = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    // El primer día del mes (0=Domingo, 1=Lunes, ..., 6=Sábado)
    // Lo ajustamos para que la semana empiece en Lunes (0=Lunes, ..., 6=Domingo)
    let primerDiaDelMes = new Date(anio, mes, 1).getDay();
    primerDiaDelMes = (primerDiaDelMes === 0) ? 6 : primerDiaDelMes - 1;

    // El último día del mes
    const ultimoDiaDelMes = new Date(anio, mes + 1, 0).getDate();

    this.diasDelCalendario = [];

    // Añadir los días de relleno al principio para alinear con el Lunes
    for (let i = 0; i < primerDiaDelMes; i++) {
      this.diasDelCalendario.push({ dia: null, esHoy: false });
    }

    // Añadir los días reales del mes
    for (let dia = 1; dia <= ultimoDiaDelMes; dia++) {
      const esHoy = dia === this.hoy.getDate() && mes === this.hoy.getMonth() && anio === this.hoy.getFullYear();
      this.diasDelCalendario.push({ dia: dia, esHoy: esHoy });
    }
  }
}