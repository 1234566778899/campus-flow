import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Publicacion } from '../../../model/publicacion';
import { PublicacionService } from '../../../services/publicacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publicacion-registrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './publicacion-registrar.component.html',
  styleUrl: './publicacion-registrar.component.css',
})
export class PublicacionRegistroComponent implements OnInit {
  publicacionForm!: FormGroup;
  idGrupoForo: number | null = null; // Para almacenar el ID del foro al que pertenece la publicación

  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute, // Para obtener el idGrupoForo de la URL
    private router: Router // Para la navegación
  ) { }

  ngOnInit(): void {
    // Obtener el idGrupoForo de los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('idGrupoForo');
      if (id) {
        this.idGrupoForo = +id; // Convertir a número
      } else {
        this.snackBar.open('Error: ID de grupo de foro no proporcionado para registrar publicación.', 'Cerrar', { duration: 5000 });
        this.router.navigate(['/estudiante-dashboard/foro']); // Redirigir si no hay ID de foro
      }
    });

    this.publicacionForm = this.fb.group({
      contenido: ['', Validators.required],
      label: ['', Validators.required],
      // La fecha se puede generar en el backend o aquí como la fecha actual
      // estado: [true] // El estado por defecto es true al registrar
    });
  }

  /**
   * Maneja el envío del formulario para registrar una nueva publicación.
   */
  onSubmit(): void {
    if (this.publicacionForm.valid && this.idGrupoForo !== null) {
      const newPublicacion: Publicacion = {
        Contenido: this.publicacionForm.value.contenido,
        Fecha: new Date().toISOString().split('T')[0], // Formato 'YYYY-MM-DD' para LocalDate de Java
        label: this.publicacionForm.value.label,
        Estado: true, // Por defecto al crear
        idGrupoForo: this.idGrupoForo // Asignar el ID del foro obtenido de la URL
      };

      this.publicacionService.createPublicacion(newPublicacion).subscribe({
        next: (response: Publicacion) => {
          this.snackBar.open('Publicación registrada exitosamente!', 'Cerrar', { duration: 3000 });
          // Navegar de vuelta a la lista de publicaciones del foro
          this.router.navigate(['/estudiante-dashboard/foro', this.idGrupoForo, 'publicaciones']);
        },
        error: (err) => {
          console.error('Error al registrar publicación:', err);
          this.snackBar.open('Error al registrar publicación: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Navega de regreso a la pantalla de publicaciones del foro actual.
   */
  goBack(): void {
    if (this.idGrupoForo) {
      this.router.navigate(['/estudiante-dashboard/foro', this.idGrupoForo, 'publicaciones']);
    } else {
      this.router.navigate(['/estudiante-dashboard/foro']); // Si no hay ID de foro, ir a la lista de foros
    }
  }
}
