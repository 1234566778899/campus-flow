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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Evento } from '../../model/evento';
import { EventoService } from '../../services/evento.service';
import { RegistrarEventoModalComponent } from './registrar-evento-modal.component';


interface EstadisticasEventos {
  totalEventos: number;
  eventosProgramados: number;
  eventosCompletados: number;
  eventosHoy: number;
  proximosEventos: number;
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

  eventos: Evento[] = [];
  dataSource = new MatTableDataSource<Evento>();
  filtroForm: FormGroup;
  isLoading = false;
  idProfesor = 1; // Este valor debería venir del servicio de autenticación

  displayedColumns: string[] = ['evento', 'fechas', 'puntaje', 'estado', 'acciones'];

  estadisticas: EstadisticasEventos = {
    totalEventos: 0,
    eventosProgramados: 0,
    eventosCompletados: 0,
    eventosHoy: 0,
    proximosEventos: 0
  };

  estadosEvento = [
    { value: true, label: 'Activo', color: 'primary' },
    { value: false, label: 'Inactivo', color: 'warn' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eventoService: EventoService
  ) {
    this.filtroForm = this.fb.group({
      search: [''],
      estado: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    this.loadEventos();
    this.setupFormSubscriptions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupFilter();
  }

  loadEventos(): void {
    this.isLoading = true;
    this.eventoService.getEventosByProfesorId(this.idProfesor).subscribe({
      next: (eventos) => {
        console.log('Eventos cargados:', eventos);
        // Verificar que eventos sea un array válido
        this.eventos = Array.isArray(eventos) ? eventos : [];
        this.dataSource.data = this.eventos;
        this.calcularEstadisticas();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando eventos:', error);
        this.eventos = []; // Asegurar que eventos sea un array vacío en caso de error
        this.dataSource.data = [];
        this.calcularEstadisticas();
        this.mostrarError('Error al cargar los eventos');
        this.isLoading = false;
      }
    });
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
      const estadoFilter = filters.estado;
      const fechaDesde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
      const fechaHasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;

      const matchesSearch = !searchTerm ||
        data.nombre.toLowerCase().includes(searchTerm) ||
        data.descripcion.toLowerCase().includes(searchTerm);

      const matchesEstado = estadoFilter === '' || estadoFilter === null || data.estado === estadoFilter;

      let matchesFecha = true;
      if (fechaDesde || fechaHasta) {
        const eventoFecha = new Date(data.fechaInicio);
        if (fechaDesde && eventoFecha < fechaDesde) matchesFecha = false;
        if (fechaHasta && eventoFecha > fechaHasta) matchesFecha = false;
      }

      return matchesSearch && matchesEstado && matchesFecha;
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
    if (!Array.isArray(this.eventos)) {
      this.eventos = [];
    }

    this.estadisticas.totalEventos = this.eventos.length;
    this.estadisticas.eventosProgramados = this.eventos.filter(e => e.estado === true).length;
    this.estadisticas.eventosCompletados = this.eventos.filter(e => e.estado === false).length;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.estadisticas.eventosHoy = this.eventos.filter(e => {
      if (!e.fechaInicio) return false;
      const fechaEvento = new Date(e.fechaInicio);
      fechaEvento.setHours(0, 0, 0, 0);
      return fechaEvento.getTime() === hoy.getTime();
    }).length;

    const proximaSemana = new Date();
    proximaSemana.setDate(proximaSemana.getDate() + 7);

    this.estadisticas.proximosEventos = this.eventos.filter(e => {
      if (!e.fechaInicio || e.estado !== true) return false;
      const fechaEvento = new Date(e.fechaInicio);
      return fechaEvento >= hoy && fechaEvento <= proximaSemana;
    }).length;
  }

  nuevoEvento(): void {
    const dialogRef = this.dialog.open(RegistrarEventoModalComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: {
        idProfesor: this.idProfesor,
        esEdicion: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mostrarExito('Evento creado correctamente');
        this.loadEventos();
      }
    });
  }

  editarEvento(evento: Evento): void {
    const dialogRef = this.dialog.open(RegistrarEventoModalComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: {
        evento: evento,
        idProfesor: this.idProfesor,
        esEdicion: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mostrarExito('Evento actualizado correctamente');
        this.loadEventos();
      }
    });
  }

  duplicarEvento(evento: Evento): void {
    const eventoDuplicado: Evento = {
      ...evento,
      idEvento: 0,
      nombre: `${evento.nombre} (Copia)`
    };

    this.eventoService.createEvento(eventoDuplicado).subscribe({
      next: () => {
        this.mostrarExito('Evento duplicado correctamente');
        this.loadEventos();
      },
      error: (error) => {
        this.mostrarError('Error al duplicar el evento');
      }
    });
  }

  cambiarEstadoEvento(evento: Evento): void {
    const eventoActualizado: Evento = {
      ...evento,
      estado: !evento.estado
    };

    this.eventoService.updateEvento(evento.idEvento, eventoActualizado).subscribe({
      next: () => {
        const mensaje = evento.estado ? 'Evento desactivado' : 'Evento activado';
        this.mostrarExito(mensaje);
        this.loadEventos();
      },
      error: (error) => {
        this.mostrarError('Error al cambiar el estado del evento');
      }
    });
  }

  eliminarEvento(evento: Evento): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el evento "${evento.nombre}"?`)) {
      this.eventoService.deleteEvento(evento.idEvento).subscribe({
        next: () => {
          this.mostrarExito('Evento eliminado correctamente');
          this.loadEventos();
        },
        error: (error) => {
          this.mostrarError('Error al eliminar el evento');
        }
      });
    }
  }

  exportarEventos(): void {
    const csvContent = this.generarCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eventos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    this.mostrarExito('Eventos exportados correctamente');
  }

  private generarCSV(): string {
    const headers = ['ID', 'Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Puntaje Recompensa', 'Estado'];
    const rows = this.eventos.map(evento => [
      evento.idEvento,
      `"${evento.nombre}"`,
      `"${evento.descripcion}"`,
      evento.fechaInicio,
      evento.fechaFin,
      evento.puntajeRecompensa,
      evento.estado ? 'Activo' : 'Inactivo'
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Métodos de utilidad
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

  esEventoProximo(fecha: string): boolean {
    if (!fecha) return false;
    try {
      const hoy = new Date();
      const fechaEvento = new Date(fecha);
      const diferenciaDias = Math.ceil((fechaEvento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
      return diferenciaDias >= 0 && diferenciaDias <= 7;
    } catch (error) {
      return false;
    }
  }

  esEventoHoy(fecha: string): boolean {
    if (!fecha) return false;
    try {
      const hoy = new Date();
      const fechaEvento = new Date(fecha);
      return hoy.toDateString() === fechaEvento.toDateString();
    } catch (error) {
      return false;
    }
  }

  getEstadoColor(estado: boolean): 'primary' | 'warn' {
    return estado ? 'primary' : 'warn';
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

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

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}