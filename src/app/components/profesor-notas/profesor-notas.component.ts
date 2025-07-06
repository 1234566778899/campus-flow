// src/app/components/profesor/profesor-notas/profesor-notas.component.ts
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrarNotaModalComponent } from './registrar-nota-modal.component';
import { EditarNotaModalComponent } from './editar-nota-modal.component';
import { MatDividerModule } from '@angular/material/divider';

interface NotaEstudiante {
  id: number;
  estudiante: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    avatar?: string;
  };
  asignatura: {
    id: number;
    nombre: string;
    codigo: string;
  };
  evaluaciones: Evaluacion[];
  promedioFinal: number;
  estado: 'aprobado' | 'desaprobado' | 'en_progreso';
}

interface Evaluacion {
  id: number;
  nombre: string;
  tipo: 'examen' | 'practica' | 'tarea' | 'proyecto' | 'participacion';
  nota: number | null;
  peso: number;
  fechaEvaluacion: Date;
  fechaRegistro?: Date;
  observaciones?: string;
  estado: 'pendiente' | 'registrada' | 'modificada';
}

interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  ciclo: number;
  creditos: number;
  estudiantesMatriculados: number;
}

@Component({
  selector: 'app-profesor-notas',
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
    ReactiveFormsModule,
    MatDividerModule
  ],
  templateUrl: './profesor-notas.component.html',
  styleUrls: ['./profesor-notas.component.css']
})
export class ProfesorNotasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Datos
  asignaturas: Asignatura[] = [];
  asignaturaSeleccionada: Asignatura | null = null;
  dataSource = new MatTableDataSource<NotaEstudiante>();
  evaluaciones: string[] = [];

  // Formularios
  filtroForm: FormGroup;

  // Configuración de tabla
  displayedColumns: string[] = ['estudiante', 'evaluaciones', 'promedio', 'estado', 'acciones'];

  // Estadísticas
  estadisticas = {
    totalEstudiantes: 0,
    aprobados: 0,
    desaprobados: 0,
    promedioGeneral: 0,
    evaluacionesPendientes: 0
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtroForm = this.fb.group({
      search: [''],
      asignatura: ['', Validators.required],
      estado: [''],
      evaluacion: ['']
    });
  }

  ngOnInit(): void {
    this.loadAsignaturas();
    this.setupFormSubscriptions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupFilter();
  }

  loadAsignaturas(): void {
    // Aquí conectarías con tu servicio real
    this.asignaturas = [
      {
        id: 1,
        nombre: 'Programación Web',
        codigo: 'CS-301',
        ciclo: 5,
        creditos: 4,
        estudiantesMatriculados: 28
      },
      {
        id: 2,
        nombre: 'Base de Datos',
        codigo: 'CS-302',
        ciclo: 5,
        creditos: 4,
        estudiantesMatriculados: 25
      },
      {
        id: 3,
        nombre: 'Redes de Computadoras',
        codigo: 'CS-303',
        ciclo: 6,
        creditos: 3,
        estudiantesMatriculados: 22
      }
    ];
  }

  setupFormSubscriptions(): void {
    this.filtroForm.get('asignatura')?.valueChanges.subscribe(asignaturaId => {
      if (asignaturaId) {
        this.asignaturaSeleccionada = this.asignaturas.find(a => a.id === asignaturaId) || null;
        this.loadNotasAsignatura(asignaturaId);
      }
    });
  }

  loadNotasAsignatura(asignaturaId: number): void {
    // Datos de ejemplo - conectar con tu servicio real
    const notasEjemplo: NotaEstudiante[] = [
      {
        id: 1,
        estudiante: {
          id: 1,
          nombres: 'Juan Carlos',
          apellidos: 'Pérez García',
          email: 'juan.perez@estudiante.edu',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
        },
        asignatura: {
          id: asignaturaId,
          nombre: this.asignaturaSeleccionada?.nombre || '',
          codigo: this.asignaturaSeleccionada?.codigo || ''
        },
        evaluaciones: [
          {
            id: 1,
            nombre: 'Examen Parcial',
            tipo: 'examen',
            nota: 16,
            peso: 30,
            fechaEvaluacion: new Date('2024-04-15'),
            fechaRegistro: new Date('2024-04-16'),
            estado: 'registrada'
          },
          {
            id: 2,
            nombre: 'Proyecto Final',
            tipo: 'proyecto',
            nota: 18,
            peso: 40,
            fechaEvaluacion: new Date('2024-05-20'),
            fechaRegistro: new Date('2024-05-21'),
            estado: 'registrada'
          },
          {
            id: 3,
            nombre: 'Participación',
            tipo: 'participacion',
            nota: 15,
            peso: 20,
            fechaEvaluacion: new Date('2024-06-01'),
            estado: 'registrada'
          },
          {
            id: 4,
            nombre: 'Tarea 3',
            tipo: 'tarea',
            nota: null,
            peso: 10,
            fechaEvaluacion: new Date('2024-06-15'),
            estado: 'pendiente'
          }
        ],
        promedioFinal: 16.6,
        estado: 'aprobado'
      },
      {
        id: 2,
        estudiante: {
          id: 2,
          nombres: 'María Elena',
          apellidos: 'Rodriguez López',
          email: 'maria.rodriguez@estudiante.edu',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
        },
        asignatura: {
          id: asignaturaId,
          nombre: this.asignaturaSeleccionada?.nombre || '',
          codigo: this.asignaturaSeleccionada?.codigo || ''
        },
        evaluaciones: [
          {
            id: 5,
            nombre: 'Examen Parcial',
            tipo: 'examen',
            nota: 14,
            peso: 30,
            fechaEvaluacion: new Date('2024-04-15'),
            fechaRegistro: new Date('2024-04-16'),
            estado: 'registrada'
          },
          {
            id: 6,
            nombre: 'Proyecto Final',
            tipo: 'proyecto',
            nota: 12,
            peso: 40,
            fechaEvaluacion: new Date('2024-05-20'),
            fechaRegistro: new Date('2024-05-21'),
            estado: 'registrada'
          },
          {
            id: 7,
            nombre: 'Participación',
            tipo: 'participacion',
            nota: 13,
            peso: 20,
            fechaEvaluacion: new Date('2024-06-01'),
            estado: 'registrada'
          },
          {
            id: 8,
            nombre: 'Tarea 3',
            tipo: 'tarea',
            nota: null,
            peso: 10,
            fechaEvaluacion: new Date('2024-06-15'),
            estado: 'pendiente'
          }
        ],
        promedioFinal: 12.9,
        estado: 'aprobado'
      }
    ];

    this.dataSource.data = notasEjemplo;
    this.calcularEstadisticas();
    this.extraerEvaluaciones();
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: NotaEstudiante, filter: string) => {
      if (!filter) return true;

      const filters = JSON.parse(filter);
      const searchTerm = filters.search?.toLowerCase() || '';
      const estadoFilter = filters.estado || '';
      const evaluacionFilter = filters.evaluacion || '';

      const matchesSearch = !searchTerm ||
        data.estudiante.nombres.toLowerCase().includes(searchTerm) ||
        data.estudiante.apellidos.toLowerCase().includes(searchTerm) ||
        data.estudiante.email.toLowerCase().includes(searchTerm);

      const matchesEstado = !estadoFilter || data.estado === estadoFilter;

      const matchesEvaluacion = !evaluacionFilter ||
        data.evaluaciones.some(evaluacion => evaluacion.nombre.toLowerCase().includes(evaluacionFilter.toLowerCase()));

      return matchesSearch && matchesEstado && matchesEvaluacion;
    };
  }

  applyFilter(): void {
    const filters = this.filtroForm.value;
    this.dataSource.filter = JSON.stringify(filters);
  }

  clearFilters(): void {
    this.filtroForm.patchValue({
      search: '',
      estado: '',
      evaluacion: ''
    });
    this.dataSource.filter = '';
  }

  calcularEstadisticas(): void {
    const data = this.dataSource.data;
    this.estadisticas.totalEstudiantes = data.length;
    this.estadisticas.aprobados = data.filter(n => n.estado === 'aprobado').length;
    this.estadisticas.desaprobados = data.filter(n => n.estado === 'desaprobado').length;

    if (data.length > 0) {
      this.estadisticas.promedioGeneral = data.reduce((sum, n) => sum + n.promedioFinal, 0) / data.length;
    }

    this.estadisticas.evaluacionesPendientes = data.reduce((sum, n) =>
      sum + n.evaluaciones.filter(e => e.estado === 'pendiente').length, 0
    );
  }

  extraerEvaluaciones(): void {
    const evaluacionesSet = new Set<string>();
    this.dataSource.data.forEach(nota => {
      nota.evaluaciones.forEach(evaluacion => {
        evaluacionesSet.add(evaluacion.nombre);
      });
    });
    this.evaluaciones = Array.from(evaluacionesSet);
  }

  // Métodos de acciones
  registrarNota(estudiante: NotaEstudiante, evaluacion?: Evaluacion): void {
    const dialogRef = this.dialog.open(RegistrarNotaModalComponent, {
      width: '600px',
      data: {
        estudiante: estudiante.estudiante,
        asignatura: estudiante.asignatura,
        evaluacion: evaluacion,
        evaluacionesDisponibles: this.evaluaciones
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Nota registrada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        // Recargar datos
        this.loadNotasAsignatura(this.asignaturaSeleccionada!.id);
      }
    });
  }

  editarNota(estudiante: NotaEstudiante, evaluacion: Evaluacion): void {
    const dialogRef = this.dialog.open(EditarNotaModalComponent, {
      width: '600px',
      data: {
        estudiante: estudiante.estudiante,
        asignatura: estudiante.asignatura,
        evaluacion: evaluacion
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Nota actualizada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        // Recargar datos
        this.loadNotasAsignatura(this.asignaturaSeleccionada!.id);
      }
    });
  }

  eliminarNota(estudiante: NotaEstudiante, evaluacion: Evaluacion): void {
    // Implementar confirmación y eliminación
    this.snackBar.open(`Eliminar nota de ${evaluacion.nombre}`, 'Cerrar', {
      duration: 2000
    });
  }

  exportarNotas(): void {
    if (!this.asignaturaSeleccionada) {
      this.snackBar.open('Seleccione una asignatura primero', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.snackBar.open('Exportando notas...', 'Cerrar', {
      duration: 2000
    });
  }

  verDetalleEstudiante(estudiante: any): void {
    this.snackBar.open(`Ver detalle de ${estudiante.nombres}`, 'Cerrar', {
      duration: 2000
    });
  }

  // Métodos de utilidad
  getDefaultAvatar(nombre: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;
  }

  getEvaluacionesPendientes(nota: NotaEstudiante): number {
    return nota.evaluaciones.filter(e => e.estado === 'pendiente').length;
  }

  getEvaluacionesRegistradas(nota: NotaEstudiante): number {
    return nota.evaluaciones.filter(e => e.estado === 'registrada').length;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'estado-aprobado';
      case 'desaprobado': return 'estado-desaprobado';
      case 'en_progreso': return 'estado-progreso';
      default: return '';
    }
  }

  getPromedioClass(promedio: number): string {
    if (promedio >= 17) return 'promedio-excelente';
    if (promedio >= 14) return 'promedio-bueno';
    if (promedio >= 11) return 'promedio-regular';
    return 'promedio-malo';
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (estado) {
      case 'aprobado': return 'primary';
      case 'en_progreso': return 'accent';
      case 'desaprobado': return 'warn';
      default: return undefined;
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'Aprobado';
      case 'desaprobado': return 'Desaprobado';
      case 'en_progreso': return 'En Progreso';
      default: return estado;
    }
  }

  getTipoEvaluacionIcon(tipo: string): string {
    switch (tipo) {
      case 'examen': return 'quiz';
      case 'practica': return 'science';
      case 'tarea': return 'assignment';
      case 'proyecto': return 'folder_special';
      case 'participacion': return 'forum';
      default: return 'grade';
    }
  }

  getNotaColor(nota: number | null): string {
    if (nota === null) return 'text-gray-400';
    if (nota >= 17) return 'text-green-600';
    if (nota >= 14) return 'text-blue-600';
    if (nota >= 11) return 'text-yellow-600';
    return 'text-red-600';
  }
}