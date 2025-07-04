import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'; // ¡Importar MatToolbarModule!
import { RouterModule } from '@angular/router'; // Para routerLink
import { Usuario } from '../../../model/usuario';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-navbar',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule, // Añadir MatToolbarModule aquí
    RouterModule, 
  ],
  templateUrl: './dashboard-navbar.component.html',
  styleUrl: './dashboard-navbar.component.css',
})
export class DashboardNavbarComponent implements OnInit {
  userName: string = 'Usuario'; // Propiedad para almacenar el nombre del usuario
  userAvatar: string = 'img/user_profile1.png'; // Ruta por defecto del avatar

  constructor(private authService: AuthService) { } // Inyectar AuthService

  ngOnInit(): void {
    this.loadUserName();
  }

  loadUserName(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserDetails(userId).subscribe(
        (usuario: Usuario) => {
          this.userName = `${usuario.nombre} ${usuario.apellido}`;
          // Opcional: Si tu Usuario tiene un campo para la URL del avatar, lo actualizarías aquí
          // this.userAvatar = usuario.avatarUrl || 'assets/images/user-avatar.png';
        },
        error => {
          console.error('Error al cargar los detalles del usuario:', error);
          this.userName = 'Error al cargar'; // Mostrar un mensaje de error
        }
      );
    } else {
      console.warn('ID de usuario no encontrado en localStorage.');
      this.userName = 'Invitado';
    }
  }
}
