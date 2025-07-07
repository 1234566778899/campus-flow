import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NotasAgrupadasDTO } from '../../model/NotasAgrupadas';
import { Nota } from '../../model/nota';
import { Estudiante } from '../../model/estudiante';
import { AuthService } from '../../services/auth.service';
import { EstudianteService } from '../../services/estudiante.service';
import { NotaService } from '../../services/nota.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notas-asignatura',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    // MatExpansionModule, // Removido
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notas-asignatura.component.html',
  styleUrl: './notas-asignatura.component.css'
})
export class NotasAsignaturaComponent implements OnInit {
  // Cambiado para contener todas las notas en una lista plana
  allNotas: Nota[] = [];
  isLoading: boolean = true;
  // Columnas para la tabla única, incluyendo 'nombreAsignatura'
  displayedColumns: string[] = ['nombreAsignatura', 'tipo', 'puntaje', 'peso'];

  constructor(
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private notaService: NotaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadNotas();
  }

  loadNotas(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.snackBar.open('Error: ID de usuario no encontrado. Por favor, inicie sesión nuevamente.', 'Cerrar', { duration: 5000 });
      this.isLoading = false;
      return;
    }

    // Paso 1: Obtener el IdEstudiante a partir del userId
    this.estudianteService.getEstudianteByUserId(userId).subscribe({
      next: (estudiante: Estudiante) => {
        if (estudiante && estudiante.idEstudiante) {
          this.notaService.getNotasByEstudianteId(estudiante.idEstudiante).subscribe({
            next: (notas: Nota[]) => {
              this.allNotas = notas; // Asigna directamente todas las notas al dataSource
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error al obtener notas del estudiante:', err);
              this.snackBar.open('Error al cargar las notas: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
              this.isLoading = false;
            }
          });
        } else {
          this.snackBar.open('No se encontró información de estudiante para su usuario.', 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener estudiante por ID de usuario:', err);
        this.snackBar.open('Error al obtener su información de estudiante: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}
