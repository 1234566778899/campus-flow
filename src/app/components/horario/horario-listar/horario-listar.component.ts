import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
export interface Horario {
  idHorario?: number;
  dia: Date;
  horaInicio: Date;
  horaFin: Date;
  Estado: boolean;
  idAsignatura: number;
}

export interface Asignatura {
  idAsignatura: number;
  nombre: string;
  profesor: string;
  aula: string;
  color: string;
}

interface HorarioConAsignatura extends Horario {
  asignatura?: Asignatura;
}

@Component({
  selector: 'app-horario-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './horario-listar.component.html',
  styleUrl: './horario-listar.component.css'
})
export class HorarioListarComponent implements OnInit {

  horarios: HorarioConAsignatura[] = [];
  horarioSemanal: { [key: string]: HorarioConAsignatura[] } = {};
  vistaActual: 'semanal' | 'lista' = 'semanal';

  diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  horasDisponibles = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Datos de ejemplo de asignaturas
  private asignaturas: Asignatura[] = [
    { idAsignatura: 1, nombre: 'Matemáticas Avanzadas', profesor: 'Dr. García', aula: 'A-101', color: 'bg-blue-500' },
    { idAsignatura: 2, nombre: 'Física Cuántica', profesor: 'Dra. López', aula: 'B-205', color: 'bg-green-500' },
    { idAsignatura: 3, nombre: 'Historia Mundial', profesor: 'Prof. Martínez', aula: 'C-301', color: 'bg-yellow-500' },
    { idAsignatura: 4, nombre: 'Química Orgánica', profesor: 'Dr. Rodríguez', aula: 'D-102', color: 'bg-red-500' },
    { idAsignatura: 5, nombre: 'Programación Web', profesor: 'Ing. Sánchez', aula: 'E-404', color: 'bg-purple-500' },
    { idAsignatura: 6, nombre: 'Literatura', profesor: 'Prof. Jiménez', aula: 'F-303', color: 'bg-pink-500' },
    { idAsignatura: 7, nombre: 'Inglés Avanzado', profesor: 'Ms. Anderson', aula: 'G-201', color: 'bg-indigo-500' }
  ];

  // Datos de ejemplo de horarios
  private horariosEjemplo: Horario[] = [
    // Lunes
    { idHorario: 1, dia: this.crearFecha(1), horaInicio: this.crearHora(8, 0), horaFin: this.crearHora(10, 0), Estado: true, idAsignatura: 1 },
    { idHorario: 2, dia: this.crearFecha(1), horaInicio: this.crearHora(10, 0), horaFin: this.crearHora(12, 0), Estado: true, idAsignatura: 2 },
    { idHorario: 3, dia: this.crearFecha(1), horaInicio: this.crearHora(14, 0), horaFin: this.crearHora(16, 0), Estado: true, idAsignatura: 3 },

    // Martes
    { idHorario: 4, dia: this.crearFecha(2), horaInicio: this.crearHora(9, 0), horaFin: this.crearHora(11, 0), Estado: true, idAsignatura: 4 },
    { idHorario: 5, dia: this.crearFecha(2), horaInicio: this.crearHora(13, 0), horaFin: this.crearHora(15, 0), Estado: true, idAsignatura: 5 },
    { idHorario: 6, dia: this.crearFecha(2), horaInicio: this.crearHora(15, 0), horaFin: this.crearHora(17, 0), Estado: true, idAsignatura: 6 },

    // Miércoles
    { idHorario: 7, dia: this.crearFecha(3), horaInicio: this.crearHora(8, 0), horaFin: this.crearHora(10, 0), Estado: true, idAsignatura: 1 },
    { idHorario: 8, dia: this.crearFecha(3), horaInicio: this.crearHora(11, 0), horaFin: this.crearHora(13, 0), Estado: true, idAsignatura: 7 },
    { idHorario: 9, dia: this.crearFecha(3), horaInicio: this.crearHora(16, 0), horaFin: this.crearHora(18, 0), Estado: true, idAsignatura: 2 },

    // Jueves
    { idHorario: 10, dia: this.crearFecha(4), horaInicio: this.crearHora(9, 0), horaFin: this.crearHora(11, 0), Estado: true, idAsignatura: 4 },
    { idHorario: 11, dia: this.crearFecha(4), horaInicio: this.crearHora(14, 0), horaFin: this.crearHora(16, 0), Estado: true, idAsignatura: 3 },
    { idHorario: 12, dia: this.crearFecha(4), horaInicio: this.crearHora(17, 0), horaFin: this.crearHora(19, 0), Estado: true, idAsignatura: 5 },

    // Viernes
    { idHorario: 13, dia: this.crearFecha(5), horaInicio: this.crearHora(8, 0), horaFin: this.crearHora(10, 0), Estado: true, idAsignatura: 6 },
    { idHorario: 14, dia: this.crearFecha(5), horaInicio: this.crearHora(10, 0), horaFin: this.crearHora(12, 0), Estado: true, idAsignatura: 7 },
    { idHorario: 15, dia: this.crearFecha(5), horaInicio: this.crearHora(15, 0), horaFin: this.crearHora(17, 0), Estado: true, idAsignatura: 1 }
  ];

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.cargarHorarios();
  }

  private crearFecha(diaSemana: number): Date {
    const hoy = new Date();
    const diaActual = hoy.getDay() || 7; // Domingo = 7
    const diferencia = diaSemana - diaActual;
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + diferencia);
    return fecha;
  }

  private crearHora(hora: number, minutos: number): Date {
    const fecha = new Date();
    fecha.setHours(hora, minutos, 0, 0);
    return fecha;
  }

  cargarHorarios() {
    // Combinar horarios con asignaturas
    this.horarios = this.horariosEjemplo.map(horario => {
      const asignatura = this.asignaturas.find(a => a.idAsignatura === horario.idAsignatura);
      return { ...horario, asignatura };
    });

    this.organizarHorarioSemanal();
  }

  organizarHorarioSemanal() {
    this.horarioSemanal = {};

    this.diasSemana.forEach(dia => {
      this.horarioSemanal[dia] = [];
    });

    this.horarios.forEach(horario => {
      if (horario.Estado) {
        const diaNombre = this.getDiaNombre(horario.dia);
        if (!this.horarioSemanal[diaNombre]) {
          this.horarioSemanal[diaNombre] = [];
        }
        this.horarioSemanal[diaNombre].push(horario);
      }
    });

    // Ordenar horarios por hora de inicio en cada día
    Object.keys(this.horarioSemanal).forEach(dia => {
      this.horarioSemanal[dia].sort((a, b) =>
        a.horaInicio.getTime() - b.horaInicio.getTime()
      );
    });
  }

  getDiaNombre(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  cambiarVista(vista: 'semanal' | 'lista') {
    this.vistaActual = vista;
  }

  esDiaActual(dia: string): boolean {
    const hoy = new Date();
    const diaHoy = this.getDiaNombre(hoy);
    return dia === diaHoy;
  }

  getClaseHorarioActual(horario: HorarioConAsignatura): boolean {
    const ahora = new Date();
    const diaHoy = this.getDiaNombre(ahora);
    const diaHorario = this.getDiaNombre(horario.dia);

    if (diaHoy !== diaHorario) return false;

    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
    const horaInicio = horario.horaInicio.getHours() * 60 + horario.horaInicio.getMinutes();
    const horaFin = horario.horaFin.getHours() * 60 + horario.horaFin.getMinutes();

    return horaActual >= horaInicio && horaActual <= horaFin;
  }

  eliminarHorario(idHorario: number) {
    this.horarios = this.horarios.filter(h => h.idHorario !== idHorario);
    this.organizarHorarioSemanal();

    this.snackBar.open('Horario eliminado', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  toggleEstadoHorario(horario: HorarioConAsignatura) {
    horario.Estado = !horario.Estado;
    this.organizarHorarioSemanal();

    const mensaje = horario.Estado ? 'Horario activado' : 'Horario desactivado';
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getTotalHorasSemanales(): number {
    let totalMinutos = 0;
    this.horarios.forEach(horario => {
      if (horario.Estado) {
        const duracion = horario.horaFin.getTime() - horario.horaInicio.getTime();
        totalMinutos += duracion / (1000 * 60);
      }
    });
    return totalMinutos / 60;
  }

  getHorariosPorDia(dia: string): HorarioConAsignatura[] {
    return this.horarioSemanal[dia] || [];
  }

  getProximaClase(): HorarioConAsignatura | null {
    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const diaActual = this.getDiaNombre(ahora);

    // Buscar en el día actual
    const clasesHoy = this.getHorariosPorDia(diaActual);
    for (const clase of clasesHoy) {
      const minutosInicio = clase.horaInicio.getHours() * 60 + clase.horaInicio.getMinutes();
      if (minutosInicio > minutosActuales) {
        return clase;
      }
    }

    // Buscar en días siguientes
    const indiceActual = this.diasSemana.indexOf(diaActual);
    for (let i = 1; i < this.diasSemana.length; i++) {
      const indiceSiguiente = (indiceActual + i) % this.diasSemana.length;
      const diaSiguiente = this.diasSemana[indiceSiguiente];
      const clases = this.getHorariosPorDia(diaSiguiente);
      if (clases.length > 0) {
        return clases[0];
      }
    }

    return null;
  }

  getTotalAsignaturas(): number {
    const asignaturasUnicas = new Set(
      this.horarios.filter(h => h.Estado).map(h => h.idAsignatura)
    );
    return asignaturasUnicas.size;
  }
}