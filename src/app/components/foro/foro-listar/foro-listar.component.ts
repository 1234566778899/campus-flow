// src/app/components/foro-listar/foro-listar.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { GrupoForoService } from '../../../services/grupo-foro.service';
import { GrupoForo } from '../../../model/grupoForo';

@Component({
  selector: 'app-foro-listar',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './foro-listar.component.html',
  styleUrl: './foro-listar.component.css',
})
export class ForoListarComponent implements OnInit {
  gruposForo: GrupoForo[] = [];
  isLoading: boolean = true;
  // Columnas a mostrar en la tabla de foros
  displayedColumns: string[] = ['titulo', 'descripcion', 'nombreAsignatura', 'fechaCreacion', 'acciones'];

  constructor(
    private grupoForoService: GrupoForoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGruposForo();
  }

  /**
   * Carga la lista de grupos de foro desde el servicio.
   */
  loadGruposForo(): void {
    this.isLoading = true;
    this.grupoForoService.getGruposForo().subscribe({
      next: (data: GrupoForo[]) => {
        console.log('Grupos de foro cargados:', data);
        this.gruposForo = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los grupos de foro:', err);
        this.snackBar.open('Error al cargar los foros: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  /**
   * Navega a la pantalla de publicaciones de un grupo de foro específico.
   * @param idGrupoForo El ID del grupo de foro.
   */
  verPublicaciones(idGrupoForo: number | undefined): void {
    console.log('Ver publicaciones para el grupo de foro con ID:', idGrupoForo);
    if (idGrupoForo) {
      // Navega a la ruta de publicaciones, pasando el ID del grupo de foro
      this.router.navigate(['/dashboard-estudiante/foro/', idGrupoForo]);
    } else {
      this.snackBar.open('ID de foro no disponible.', 'Cerrar', { duration: 3000 });
    }
  }
}