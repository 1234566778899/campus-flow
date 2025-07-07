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
import { MatDividerModule } from '@angular/material/divider';
import { forkJoin } from 'rxjs';



// Componentes modales
import { RegistrarNotaModalComponent } from './registrar-nota-modal.component';
import { EditarNotaModalComponent } from './editar-nota-modal.component';
import { Asignatura } from '../horario/horario-listar/horario-listar.component';
import { Estudiante } from '../../model/estudiante';
import { Nota } from '../../model/nota';
import { NotaEstudiante } from '../../model/NotaEstudiante';
import { NotaService } from '../../services/nota.service';
import { EstudianteService } from '../../services/estudiante.service';
import { AsignaturaService } from '../../services/asignatura.service';
import { ResumenNotas } from '../../model/ResumenNotas';
import { MatSpinner } from '@angular/material/progress-spinner';

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
    MatDividerModule,
    MatSpinner
  ],
  templateUrl: './profesor-notas.component.html',
  styleUrls: ['./profesor-notas.component.css']
})
export class ProfesorNotasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Datos
  asignaturas: Asignatura[] = [];
  estudiantes: Estudiante[] = [];
  notas: Nota[] = [];
  asignaturaSeleccionada: Asignatura | null = null;
  dataSource = new MatTableDataSource<NotaEstudiante>();
  tiposEvaluacion: string[] = ['Examen', 'Práctica', 'Tarea', 'Proyecto', 'Participación'];

  // Formularios
  filtroForm: FormGroup;
  isLoading = false;

  // Configuración de tabla
  displayedColumns: string[] = ['estudiante', 'notas', 'promedio', 'estado', 'acciones'];

  // Estadísticas
  estadisticas: ResumenNotas = {
    totalEstudiantes: 0,
    aprobados: 0,
    desaprobados: 0,
    promedioGeneral: 0,
    notasPendientes: 0
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notaService: NotaService,
    private estudianteService: EstudianteService,
    private asignaturaService: AsignaturaService
  ) {
    this.filtroForm = this.fb.group({
      search: [''],
      asignatura: ['', Validators.required],
      estado: [''],
      tipoNota: ['']
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
    this.isLoading = true;
    this.asignaturaService.getAsignaturasByProfesor().subscribe({
      next: (asignaturas: any) => {
        this.asignaturas = asignaturas;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar asignaturas:', err);
        this.snackBar.open('Error al cargar las asignaturas', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        // Fallback con datos de ejemplo si no hay endpoint
        this.loadAsignaturasFallback();
      }
    });
  }

  loadAsignaturasFallback(): void {

  }

  setupFormSubscriptions(): void {
    this.filtroForm.get('asignatura')?.valueChanges.subscribe(asignaturaId => {
      if (asignaturaId) {
        this.asignaturaSeleccionada = this.asignaturas.find(a => a.idAsignatura === asignaturaId) || null;
        this.loadNotasAsignatura(asignaturaId);
      }
    });
  }

  loadNotasAsignatura(asignaturaId: number): void {
    this.isLoading = true;

    // Cargar notas, estudiantes de la asignatura en paralelo
    forkJoin({
      notas: this.notaService.getNotasByAsignaturaId(asignaturaId),
      estudiantes: this.estudianteService.getEstudiantesByAsignatura(asignaturaId)
    }).subscribe({
      next: ({ notas, estudiantes }) => {
        this.notas = notas;
        this.estudiantes = estudiantes;
        this.procesarDatosParaTabla();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.snackBar.open('Error al cargar los datos de la asignatura', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        // Fallback con datos de ejemplo
        //   this.loadDatosEjemplo(asignaturaId);
      }
    });
  }


  procesarDatosParaTabla(): void {
    const notasEstudiantes: NotaEstudiante[] = [];

    this.estudiantes.forEach(estudiante => {
      const notasEstudiante = this.notas;

      // Calcular promedio ponderado
      let promedioFinal = 0;
      let pesoTotal = 0;

      if (notasEstudiante.length > 0) {
        notasEstudiante.forEach(nota => {
          promedioFinal += (nota.Puntaje || 0) * ((nota.Peso_Nota || 0) / 100);
          pesoTotal += (nota.Peso_Nota || 0);
        });

        if (pesoTotal > 0) {
          promedioFinal = (promedioFinal / pesoTotal) * 100;
        }
      }

      // Determinar estado
      let estado: 'aprobado' | 'desaprobado' | 'en_progreso' = 'en_progreso';
      if (pesoTotal >= 100) {
        estado = promedioFinal >= 11 ? 'aprobado' : 'desaprobado';
      }

      const notaEstudiante: NotaEstudiante = {
        estudiante: estudiante,
        asignatura: this.asignaturaSeleccionada!,
        notas: notasEstudiante,
        promedioFinal: promedioFinal,
        estado: estado,
        notasPendientes: Math.max(0, 4 - notasEstudiante.length), // Asumiendo 4 evaluaciones
        notasRegistradas: notasEstudiante.length
      };

      notasEstudiantes.push(notaEstudiante);
    });

    this.dataSource.data = notasEstudiantes;
    this.calcularEstadisticas();
  }

  setupFilter(): void {
    // this.dataSource.filterPredicate = (data: NotaEstudiante, filter: string) => {
    //   if (!filter) return true;

    //   const filters = JSON.parse(filter);
    //   const searchTerm = filters.search?.toLowerCase() || '';
    //   const estadoFilter = filters.estado || '';
    //   const tipoNotaFilter = filters.tipoNota || '';

    //   // const matchesSearch = !searchTerm ||
    //   //   data.estudiante.nombres.toLowerCase().includes(searchTerm) ||
    //   //   data.estudiante.apellidos.toLowerCase().includes(searchTerm) ||
    //   //   data.estudiante.email.toLowerCase().includes(searchTerm);

    //   // const matchesEstado = !estadoFilter || data.estado === estadoFilter;

    //   // const matchesTipoNota = !tipoNotaFilter ||
    //   //   data.notas.some(nota => nota.tipo.toLowerCase().includes(tipoNotaFilter.toLowerCase()));

    // };
  }

  applyFilter(): void {
    const filters = this.filtroForm.value;
    this.dataSource.filter = JSON.stringify(filters);
  }

  clearFilters(): void {
    this.filtroForm.patchValue({
      search: '',
      estado: '',
      tipoNota: ''
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

    this.estadisticas.notasPendientes = data.reduce((sum, n) => sum + n.notasPendientes, 0);
  }

  // Métodos de acciones
  registrarNota(estudiante: NotaEstudiante, nota?: Nota): void {
    const dialogRef = this.dialog.open(RegistrarNotaModalComponent, {
      width: '600px',
      data: {
        estudiante: estudiante.estudiante,
        asignatura: estudiante.asignatura,
        nota: nota,
        tiposDisponibles: this.tiposEvaluacion
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Crear la nota usando el servicio
        const nuevaNota: Nota = {
          idNota: 0, // Se asigna en el backend
          Tipo: result.tipo,
          Puntaje: result.puntaje,
          Peso_Nota: result.peso_Nota,
          idAsignatura: estudiante.asignatura.idAsignatura,
          idEstudiante: 1,
          Estado: true
        };

        this.notaService.createNota(nuevaNota).subscribe({
          next: () => {
            this.snackBar.open('Nota registrada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            // Recargar datos
            this.loadNotasAsignatura(this.asignaturaSeleccionada!.idAsignatura);
          },
          error: (err) => {
            console.error('Error al registrar nota:', err);
            this.snackBar.open('Error al registrar la nota', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  editarNota(estudiante: NotaEstudiante, nota: Nota): void {
    const dialogRef = this.dialog.open(EditarNotaModalComponent, {
      width: '600px',
      data: {
        estudiante: estudiante.estudiante,
        asignatura: estudiante.asignatura,
        nota: nota
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const notaActualizada: Nota = {
          ...nota,
          Puntaje: result.puntaje,
          Tipo: result.tipo || nota.Tipo,
          Peso_Nota: result.peso_Nota || nota.Peso_Nota
        };

        this.notaService.updateNota(nota.idNota || 0, notaActualizada).subscribe({
          next: () => {
            this.snackBar.open('Nota actualizada correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            // Recargar datos
            this.loadNotasAsignatura(this.asignaturaSeleccionada!.idAsignatura);
          },
          error: (err) => {
            console.error('Error al actualizar nota:', err);
            this.snackBar.open('Error al actualizar la nota', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  eliminarNota(estudiante: NotaEstudiante, nota: Nota): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      this.notaService.deleteNota(nota.idNota || 0).subscribe({
        next: () => {
          this.snackBar.open('Nota eliminada correctamente', 'Cerrar', { duration: 3000 });
          // Recargar datos
          this.loadNotasAsignatura(this.asignaturaSeleccionada!.idAsignatura);
        },
        error: (err) => {
          console.error('Error al eliminar nota:', err);
          this.snackBar.open('Error al eliminar la nota', 'Cerrar', { duration: 3000 });
        }
      });
    }
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

  verDetalleEstudiante(estudiante: Estudiante): void {
    this.snackBar.open(`Ver detalle de ${estudiante.nombres}`, 'Cerrar', {
      duration: 2000
    });
  }

  // Métodos de utilidad
  getDefaultAvatar(nombre: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;
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

  getTipoNotaIcon(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'examen': return 'quiz';
      case 'practica': return 'science';
      case 'práctica': return 'science';
      case 'tarea': return 'assignment';
      case 'proyecto': return 'folder_special';
      case 'participacion': return 'forum';
      case 'participación': return 'forum';
      default: return 'grade';
    }
  }

  getNotaColor(puntaje: number | null): string {
    if (puntaje === null) return 'text-gray-400';
    if (puntaje >= 17) return 'text-green-600';
    if (puntaje >= 14) return 'text-blue-600';
    if (puntaje >= 11) return 'text-yellow-600';
    return 'text-red-600';
  }
}