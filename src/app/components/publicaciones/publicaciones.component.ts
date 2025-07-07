// src/app/components/publicaciones/publicaciones.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PublicacionService } from '../../services/publicacion.service';
import { Publicacion } from '../../model/publicacion';

@Component({
  selector: 'app-publicaciones',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  isLoading: boolean = true;
  isCreating: boolean = false;
  idGrupoForo: number | null = null;

  // Filtros
  filtroLabel: string = '';
  filtroFecha: Date | null = null;

  // Formulario para nueva publicación
  publicacionForm: FormGroup;
  showCreateForm: boolean = false;

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['contenido', 'fecha', 'label', 'acciones'];

  // Labels disponibles (puedes obtenerlos del servicio o definirlos)
  labelsDisponibles: string[] = ['General', 'Anuncio', 'Pregunta', 'Tarea', 'Examen'];

  constructor(
    private publicacionService: PublicacionService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    // Inicializar el formulario reactivo
    this.publicacionForm = this.formBuilder.group({
      contenido: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      label: ['General', [Validators.required]],
      fecha: [new Date(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener el ID del grupo de foro de los parámetros de ruta
    this.route.params.subscribe(params => {
      this.idGrupoForo = +params['idGrupo'];
      if (this.idGrupoForo) {
        this.loadPublicaciones();
      } else {
        this.snackBar.open('ID de grupo de foro no válido.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard-estudiante/foro']);
      }
    });
  }

  /**
   * Carga todas las publicaciones (sin filtros) inicialmente
   */
  loadPublicaciones(): void {
    this.isLoading = true;
    // Como no tienes un endpoint específico para obtener todas las publicaciones de un grupo,
    // cargamos todas y filtramos en el frontend, o implementas el endpoint en el backend
    this.publicacionService.getPublicaciones().subscribe({
      next: (data: Publicacion[]) => {
        // Filtrar por grupo de foro en el frontend
        this.publicaciones = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones:', err);
        this.snackBar.open('Error al cargar las publicaciones: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica filtros a las publicaciones
   */
  aplicarFiltros(): void {
    if (!this.idGrupoForo) return;

    this.isLoading = true;

    // Si hay filtro por label
    if (this.filtroLabel) {
      this.publicacionService.getPublicacionesByGrupoForoAndLabel(this.idGrupoForo, this.filtroLabel).subscribe({
        next: (data) => {
          this.publicaciones = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al filtrar por label:', err);
          this.snackBar.open('Error al filtrar publicaciones.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
    // Si hay filtro por fecha
    else if (this.filtroFecha) {
      const fechaStr = this.filtroFecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      this.publicacionService.getPublicacionesByGrupoForoAndFecha(this.idGrupoForo, fechaStr).subscribe({
        next: (data) => {
          this.publicaciones = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al filtrar por fecha:', err);
          this.snackBar.open('Error al filtrar publicaciones.', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
    // Sin filtros, cargar todas
    else {
      this.loadPublicaciones();
    }
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros(): void {
    this.filtroLabel = '';
    this.filtroFecha = null;
    this.loadPublicaciones();
  }

  /**
   * Vuelve a la lista de foros
   */
  volverAForos(): void {
    this.router.navigate(['/estudiante-dashboard/foro']);
  }

  /**
   * Editar publicación (implementar según necesidades)
   */
  editarPublicacion(publicacion: Publicacion): void {
    // Implementar navegación a formulario de edición
    console.log('Editar publicación:', publicacion);
  }

  /**
   * Eliminar publicación
   */
  eliminarPublicacion(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.publicacionService.deletePublicacion(id).subscribe({
        next: () => {
          this.snackBar.open('Publicación eliminada correctamente.', 'Cerrar', { duration: 3000 });
          this.loadPublicaciones(); // Recargar la lista
        },
        error: (err) => {
          console.error('Error al eliminar la publicación:', err);
          this.snackBar.open('Error al eliminar la publicación.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  /**
   * Mostrar/ocultar formulario de creación
   */
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      // Resetear el formulario cuando se abre
      this.publicacionForm.reset({
        contenido: '',
        label: 'General',
        fecha: new Date()
      });
    }
  }

  /**
   * Crear nueva publicación
   */
  crearPublicacion(): void {
    if (this.publicacionForm.valid && this.idGrupoForo) {
      this.isCreating = true;

      const nuevaPublicacion: Partial<Publicacion> = {
        contenido: this.publicacionForm.value.contenido,
        label: this.publicacionForm.value.label,
        fecha: this.publicacionForm.value.fecha,
        idGrupoForo: this.idGrupoForo,
        estado: true
      };

      this.publicacionService.createPublicacion(nuevaPublicacion as Publicacion).subscribe({
        next: (publicacionCreada) => {
          this.snackBar.open('Publicación creada correctamente.', 'Cerrar', { duration: 3000 });
          this.showCreateForm = false;
          this.isCreating = false;
          this.loadPublicaciones(); // Recargar la lista para mostrar la nueva publicación

          // Resetear el formulario
          this.publicacionForm.reset({
            contenido: '',
            label: 'General',
            fecha: new Date()
          });
        },
        error: (err) => {
          console.error('Error al crear la publicación:', err);
          this.snackBar.open('Error al crear la publicación: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
          this.isCreating = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Cancelar creación
   */
  cancelarCreacion(): void {
    this.showCreateForm = false;
    this.publicacionForm.reset({
      contenido: '',
      label: 'General',
      fecha: new Date()
    });
  }

  /**
   * Obtener mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const field = this.publicacionForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} debe tener al menos ${field.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName} no puede exceder ${field.errors?.['maxlength']?.requiredLength} caracteres`;
    }
    return '';
  }
}