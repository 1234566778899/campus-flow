import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Publicacion } from '../../../model/publicacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicacionService } from '../../../services/publicacion.service';

@Component({
  selector: 'app-publicacion-listar',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule, 
  ],
  templateUrl: './publicacion-listar.component.html',
  styleUrl: './publicacion-listar.component.css',
})
export class PublicacionListarComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  isLoading: boolean = true;
  idGrupoForo: number | null = null; // Para almacenar el ID del foro
  displayedColumns: string[] = ['contenido', 'fecha', 'label', 'acciones'];

  constructor(
    private publicacionService: PublicacionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute, // Inyectar ActivatedRoute para obtener parámetros de la URL
    private router: Router // Inyectar Router
  ) { }

  ngOnInit(): void {
    // Obtener el idGrupoForo de los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('idGrupoForo');
      if (id) {
        this.idGrupoForo = +id; // Convertir a número
        this.loadPublicaciones(this.idGrupoForo);
      } else {
        this.snackBar.open('Error: ID de grupo de foro no proporcionado.', 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  /**
   * Carga la lista de publicaciones para un grupo de foro específico.
   * @param idGrupoForo El ID del grupo de foro.
   */
  loadPublicaciones(idGrupoForo: number): void {
    this.isLoading = true;
    this.publicacionService.getPublicacionesByGrupoForo(idGrupoForo).subscribe({
      next: (data: Publicacion[]) => {
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
   * Navega a la pantalla de recursos de una publicación específica.
   * @param idPublicacion El ID de la publicación.
   */
  verRecursos(idPublicacion: number | undefined): void {
    if (idPublicacion) {
      this.router.navigate(['/estudiante-dashboard/publicacion', idPublicacion, 'recursos']);
    } else {
      this.snackBar.open('ID de publicación no disponible.', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Navega a la pantalla de registro de una nueva publicación para el foro actual.
   */
  registrarNuevaPublicacion(): void {
    if (this.idGrupoForo) {
      this.router.navigate(['/estudiante-dashboard/foro', this.idGrupoForo, 'publicaciones', 'registrar']);
    } else {
      this.snackBar.open('No se puede registrar una publicación sin un ID de foro válido.', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Navega de regreso al listado de grupos de foro.
   */
  goBackToForos(): void {
    this.router.navigate(['/estudiante-dashboard/foro']);
  }
}
