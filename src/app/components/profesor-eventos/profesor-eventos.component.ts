// src/app/components/profesor/profesor-eventos/profesor-eventos.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RegistrarEventoModalComponent } from './registrar-evento-modal.component';


interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'examen' | 'tarea' | 'proyecto' | 'presentacion' | 'actividad' | 'reunion';
  asignatura: {
    id: number;
    nombre: string;
    codigo: string;
  };
  fechaInicio: Date;
  fechaFin: Date;
  horaInicio: string;
  horaFin: string;
  ubicacion?: string;
  modalidad: 'presencial' | 'virtual' | 'hibrida';
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  participantes: number;
  recordatorios: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  createdAt: Date;
  updatedAt: Date;
}

interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  estudiantesMatriculados: number;
}

@Component({
  selector: 'app-profesor-eventos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  templateUrl: './profesor-eventos.component.html',
  styleUrls: ['./profesor-eventos.component.css']
})
export class ProfesorEventosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Datos
  eventos: Evento[] = [];
  asignaturas: Asignatura[] = [];
  dataSource = new MatTableDataSource<Evento>();

  // Formularios
  filtroForm: FormGroup;

  // Configuración de tabla
  displayedColumns: string[] = ['evento', 'asignatura', 'fecha', 'tipo', 'estado', 'participantes', 'acciones'];

  // Estadísticas
  estadisticas = {
    totalEventos: 0,
    eventosProgramados: 0,
    eventosCompletados: 0,
    eventosHoy: 0,
    proximosEventos: 0
  };

  // Opciones de filtro
  tiposEvento = [
    { value: 'examen', label: 'Examen', icon: 'quiz' },
    { value: 'tarea', label: 'Tarea', icon: 'assignment' },
    { value: 'proyecto', label: 'Proyecto', icon: 'folder_special' },
    { value: 'presentacion', label: 'Presentación', icon: 'present_to_all' },
    { value: 'actividad', label: 'Actividad', icon: 'sports_esports' },
    { value: 'reunion', label: 'Reunión', icon: 'meeting_room' }
  ];

  estadosEvento = [
    { value: 'programado', label: 'Programado', color: 'primary' },
    { value: 'en_curso', label: 'En Curso', color: 'accent' },
    { value: 'completado', label: 'Completado', color: 'primary' },
    { value: 'cancelado', label: 'Cancelado', color: 'warn' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtroForm = this.fb.group({
      search: [''],
      asignatura: [''],
      tipo: [''],
      estado: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    this.loadAsignaturas();
    this.loadEventos();
    this.setupFormSubscriptions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupFilter();
  }

  loadAsignaturas(): void {
    // Datos de ejemplo - conectar con tu servicio real
    this.asignaturas = [
      {
        id: 1,
        nombre: 'Programación Web',
        codigo: 'CS-301',
        estudiantesMatriculados: 28
      },
      {
        id: 2,
        nombre: 'Base de Datos',
        codigo: 'CS-302',
        estudiantesMatriculados: 25
      },
      {
        id: 3,
        nombre: 'Redes de Computadoras',
        codigo: 'CS-303',
        estudiantesMatriculados: 22
      }
    ];
  }

  loadEventos(): void {
    // Datos de ejemplo - conectar con tu servicio real
    const eventosEjemplo: Evento[] = [
      {
        id: 1,
        titulo: 'Examen Parcial - Programación Web',
        descripcion: 'Evaluación parcial que abarca los temas de HTML, CSS y JavaScript básico.',
        tipo: 'examen',
        asignatura: {
          id: 1,
          nombre: 'Programación Web',
          codigo: 'CS-301'
        },
        fechaInicio: new Date('2024-12-20'),
        fechaFin: new Date('2024-12-20'),
        horaInicio: '09:00',
        horaFin: '11:00',
        ubicacion: 'Aula 201',
        modalidad: 'presencial',
        estado: 'programado',
        participantes: 28,
        recordatorios: true,
        prioridad: 'alta',
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 2,
        titulo: 'Entrega Proyecto Final - Base de Datos',
        descripcion: 'Presentación y entrega del proyecto final del curso. Incluye documentación y demo.',
        tipo: 'proyecto',
        asignatura: {
          id: 2,
          nombre: 'Base de Datos',
          codigo: 'CS-302'
        },
        fechaInicio: new Date('2024-12-22'),
        fechaFin: new Date('2024-12-22'),
        horaInicio: '14:00',
        horaFin: '17:00',
        ubicacion: 'Laboratorio de Cómputo 1',
        modalidad: 'presencial',
        estado: 'programado',
        participantes: 25,
        recordatorios: true,
        prioridad: 'alta',
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: 3,
        titulo: 'Taller de Configuración de Redes',
        descripcion: 'Actividad práctica para configurar routers y switches.',
        tipo: 'actividad',
        asignatura: {
          id: 3,
          nombre: 'Redes de Computadoras',
          codigo: 'CS-303'
        },
        fechaInicio: new Date('2024-12-18'),
        fechaFin: new Date('2024-12-18'),
        horaInicio: '10:00',
        horaFin: '12:00',
        ubicacion: 'Laboratorio de Redes',
        modalidad: 'presencial',
        estado: 'completado',
        participantes: 22,
        recordatorios: false,
        prioridad: 'media',
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-12-18')
      },
      {
        id: 4,
        titulo: 'Reunión de Seguimiento - Proyectos',
        descripcion: 'Reunión para revisar el progreso de los proyectos finales.',
        tipo: 'reunion',
        asignatura: {
          id: 1,
          nombre: 'Programación Web',
          codigo: 'CS-301'
        },
        fechaInicio: new Date('2024-12-15'),
        fechaFin: new Date('2024-12-15'),
        horaInicio: '15:00',
        horaFin: '16:00',
        ubicacion: 'Oficina del Profesor',
        modalidad: 'hibrida',
        estado: 'completado',
        participantes: 10,
        recordatorios: true,
        prioridad: 'media',
        createdAt: new Date('2024-12-10'),
        updatedAt: new Date('2024-12-15')
      }
    ];

    this.eventos = eventosEjemplo;
    this.dataSource.data = eventosEjemplo;
    this.calcularEstadisticas();
  }

  setupFormSubscriptions(): void {
    this.filtroForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: Evento, filter: string) => {
      if (!filter) return true;

      const filters = JSON.parse(filter);
      const searchTerm = filters.search?.toLowerCase() || '';
      const asignaturaFilter = filters.asignatura || '';
      const tipoFilter = filters.tipo || '';
      const estadoFilter = filters.estado || '';
      const fechaDesde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
      const fechaHasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;

      const matchesSearch = !searchTerm ||
        data.titulo.toLowerCase().includes(searchTerm) ||
        data.descripcion.toLowerCase().includes(searchTerm) ||
        data.asignatura.nombre.toLowerCase().includes(searchTerm);

      const matchesAsignatura = !asignaturaFilter || data.asignatura.id === asignaturaFilter;
      const matchesTipo = !tipoFilter || data.tipo === tipoFilter;
      const matchesEstado = !estadoFilter || data.estado === estadoFilter;

      let matchesFecha = true;
      if (fechaDesde || fechaHasta) {
        const eventoFecha = new Date(data.fechaInicio);
        if (fechaDesde && eventoFecha < fechaDesde) matchesFecha = false;
        if (fechaHasta && eventoFecha > fechaHasta) matchesFecha = false;
      }

      return matchesSearch && matchesAsignatura && matchesTipo && matchesEstado && matchesFecha;
    };
  }

  applyFilter(): void {
    const filters = this.filtroForm.value;
    this.dataSource.filter = JSON.stringify(filters);
  }

  clearFilters(): void {
    this.filtroForm.reset();
    this.dataSource.filter = '';
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalEventos = this.eventos.length;
    this.estadisticas.eventosProgramados = this.eventos.filter(e => e.estado === 'programado').length;
    this.estadisticas.eventosCompletados = this.eventos.filter(e => e.estado === 'completado').length;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.estadisticas.eventosHoy = this.eventos.filter(e => {
      const fechaEvento = new Date(e.fechaInicio);
      fechaEvento.setHours(0, 0, 0, 0);
      return fechaEvento.getTime() === hoy.getTime();
    }).length;

    const proximaSemana = new Date();
    proximaSemana.setDate(proximaSemana.getDate() + 7);

    this.estadisticas.proximosEventos = this.eventos.filter(e => {
      const fechaEvento = new Date(e.fechaInicio);
      return fechaEvento >= hoy && fechaEvento <= proximaSemana && e.estado === 'programado';
    }).length;
  }

  // Métodos de acciones
  nuevoEvento(): void {
    const dialogRef = this.dialog.open(RegistrarEventoModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        asignaturas: this.asignaturas,
        tiposEvento: this.tiposEvento
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Evento registrado correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadEventos(); // Recargar datos
      }
    });
  }

  editarEvento(evento: Evento): void {
    const dialogRef = this.dialog.open(RegistrarEventoModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        evento: evento,
        asignaturas: this.asignaturas,
        tiposEvento: this.tiposEvento,
        esEdicion: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Evento actualizado correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadEventos(); // Recargar datos
      }
    });
  }

  duplicarEvento(evento: Evento): void {
    const eventoDuplicado = { ...evento, id: 0, titulo: `${evento.titulo} (Copia)` };
    this.editarEvento(eventoDuplicado);
  }

  cambiarEstadoEvento(evento: Evento, nuevoEstado: string): void {
    this.snackBar.open(`Estado cambiado a: ${nuevoEstado}`, 'Cerrar', {
      duration: 3000
    });
    // Aquí implementarías la llamada al servicio
  }

  eliminarEvento(evento: Evento): void {
    // Implementar confirmación
    this.snackBar.open(`Evento "${evento.titulo}" eliminado`, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  verParticipantes(evento: Evento): void {
    this.snackBar.open(`Ver participantes de: ${evento.titulo}`, 'Cerrar', {
      duration: 2000
    });
  }

  enviarRecordatorio(evento: Evento): void {
    this.snackBar.open(`Recordatorio enviado para: ${evento.titulo}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  exportarEventos(): void {
    this.snackBar.open('Exportando eventos...', 'Cerrar', {
      duration: 2000
    });
  }

  // Métodos de utilidad
  getTipoIcon(tipo: string): string {
    const tipoEncontrado = this.tiposEvento.find(t => t.value === tipo);
    return tipoEncontrado ? tipoEncontrado.icon : 'event';
  }

  getTipoLabel(tipo: string): string {
    const tipoEncontrado = this.tiposEvento.find(t => t.value === tipo);
    return tipoEncontrado ? tipoEncontrado.label : tipo;
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' | undefined {
    const estadoEncontrado = this.estadosEvento.find(e => e.value === estado);
    return estadoEncontrado ? estadoEncontrado.color as any : undefined;
  }

  getEstadoLabel(estado: string): string {
    const estadoEncontrado = this.estadosEvento.find(e => e.value === estado);
    return estadoEncontrado ? estadoEncontrado.label : estado;
  }

  getPrioridadClass(prioridad: string): string {
    switch (prioridad) {
      case 'alta': return 'prioridad-alta';
      case 'media': return 'prioridad-media';
      case 'baja': return 'prioridad-baja';
      default: return '';
    }
  }

  getModalidadIcon(modalidad: string): string {
    switch (modalidad) {
      case 'presencial': return 'location_on';
      case 'virtual': return 'videocam';
      case 'hibrida': return 'hybrid';
      default: return 'help';
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearHora(hora: string): string {
    return hora;
  }

  esEventoProximo(fecha: Date): boolean {
    const hoy = new Date();
    const diferenciaDias = Math.ceil((new Date(fecha).getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferenciaDias >= 0 && diferenciaDias <= 7;
  }

  esEventoHoy(fecha: Date): boolean {
    const hoy = new Date();
    const fechaEvento = new Date(fecha);
    return hoy.toDateString() === fechaEvento.toDateString();
  }
}