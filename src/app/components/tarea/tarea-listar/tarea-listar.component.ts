import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { TareaService } from '../../../services/tarea.service';
import { Tarea } from '../../../model/tarea';


@Component({
  selector: 'app-tarea-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatCheckboxModule,
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './tarea-listar.component.html',
  styleUrl: './tarea-listar.component.css'
})
export class TareaListarComponent implements OnInit {

  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  filtroActivo: string = 'todas';

  // Datos de ejemplo (reemplazar con servicio real)
  private tareasEjemplo: Tarea[] = [
    {
      idTarea: 1,
      titulo: 'Presentación de proyecto',
      descripcion: 'Preparar presentación final del proyecto de investigación sobre inteligencia artificial',
      fechaLimite: new Date('2024-12-08'),
      prioridad: 'alta',
      id_estudiante: 1,
      id_horario: 1,
      estado: false
    },
    {
      idTarea: 2,
      titulo: 'Examen de medio término',
      descripcion: 'Estudiar capítulos 1-5 del libro de matemáticas avanzadas',
      fechaLimite: new Date('2024-12-09'),
      prioridad: 'alta',
      id_estudiante: 1,
      id_horario: 2,
      estado: false
    },
    {
      idTarea: 3,
      titulo: 'Ensayo de historia',
      descripcion: 'Escribir ensayo de 1000 palabras sobre la revolución industrial',
      fechaLimite: new Date('2024-12-15'),
      prioridad: 'media',
      id_estudiante: 1,
      id_horario: 3,
      estado: false
    },
    {
      idTarea: 4,
      titulo: 'Laboratorio de química',
      descripcion: 'Completar experimento sobre reacciones químicas y entregar reporte',
      fechaLimite: new Date('2024-12-12'),
      prioridad: 'baja',
      id_estudiante: 1,
      id_horario: 4,
      estado: true
    },
    {
      idTarea: 5,
      titulo: 'Proyecto grupal',
      descripcion: 'Coordinar con el equipo para la entrega del proyecto de software',
      fechaLimite: new Date('2024-12-20'),
      prioridad: 'media',
      id_estudiante: 1,
      id_horario: 5,
      estado: false
    }
  ];
  constructor(private tareaService: TareaService) {

  }
  ngOnInit() {
    this.getTareas();
  }

  cargarTareas() {
    // Aquí normalmente harías una llamada a tu servicio
    this.tareas = this.tareasEjemplo;
    this.aplicarFiltro();
  }
  getTareas() {
    this.tareaService.listar().subscribe(
      (data: Tarea[]) => {
        console.log(data);
        this.tareas = data;
        this.aplicarFiltro();
      },
      err => {
        console.log(err);
      }
    )
  }
  aplicarFiltro() {
    switch (this.filtroActivo) {
      case 'pendientes':
        this.tareasFiltradas = this.tareas.filter(tarea => !tarea.estado);
        break;
      case 'completadas':
        this.tareasFiltradas = this.tareas.filter(tarea => tarea.estado);
        break;
      case 'vencidas':
        this.tareasFiltradas = this.tareas.filter(tarea =>
          !tarea.estado && new Date(tarea.fechaLimite) < new Date()
        );
        break;
      default:
        this.tareasFiltradas = [...this.tareas];
    }

    this.tareasFiltradas.sort((a, b) =>
      new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()
    );
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.aplicarFiltro();
  }

  toggleEstadoTarea(tarea: Tarea) {
    tarea.estado = !tarea.estado;
    console.log('Tarea actualizada:', tarea);
  }

  getPrioridadColor(prioridad: string): string {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPrioridadIcon(prioridad: string): string {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return 'priority_high';
      case 'media':
        return 'remove';
      case 'baja':
        return 'keyboard_arrow_down';
      default:
        return 'help';
    }
  }

  getEstadoVencimiento(fechaLimite: Date, estado: boolean): string {
    if (estado) return 'completada';

    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diferenciaDias = Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) return 'vencida';
    if (diferenciaDias === 0) return 'vence-hoy';
    if (diferenciaDias === 1) return 'vence-mañana';

    return 'pendiente';
  }

  getEstadoTexto(fechaLimite: Date, estado: boolean): string {
    const estadoVencimiento = this.getEstadoVencimiento(fechaLimite, estado);

    switch (estadoVencimiento) {
      case 'completada':
        return 'Completada';
      case 'vencida':
        return 'Vencida';
      case 'vence-hoy':
        return 'Vence hoy';
      case 'vence-mañana':
        return 'Vence mañana';
      default:
        const dias = Math.ceil((new Date(fechaLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return `${dias} días restantes`;
    }
  }

  getEstadoColorClass(fechaLimite: Date, estado: boolean): string {
    const estadoVencimiento = this.getEstadoVencimiento(fechaLimite, estado);

    switch (estadoVencimiento) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
      case 'vence-hoy':
        return 'bg-orange-100 text-orange-800';
      case 'vence-mañana':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  eliminarTarea(idTarea: number) {
    // Aquí harías la eliminación en el backend
    this.tareas = this.tareas.filter(tarea => tarea.idTarea !== idTarea);
    this.aplicarFiltro();
    console.log('Tarea eliminada:', idTarea);
  }

  editarTarea(tarea: Tarea) {
    // Aquí navegarías al componente de edición
    console.log('Editar tarea:', tarea);
  }
  get totalTareas() {
    return this.tareas.length;
  }

  get tareasPendientes() {
    return this.tareas.filter(t => !t.estado).length;
  }

  get tareasCompletadas() {
    return this.tareas.filter(t => t.estado).length;
  }

  get tareasVencidas() {
    const hoy = new Date();
    return this.tareas.filter(t => !t.estado && new Date(t.fechaLimite) < hoy).length;
  }
}