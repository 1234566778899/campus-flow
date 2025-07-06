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
import { MatDivider } from '@angular/material/divider';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

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
    MatDivider,
    MatMenuTrigger,
    MatMenuModule
  ],
  templateUrl: './dashboard-navbar.component.html',
  styleUrl: './dashboard-navbar.component.css',
})
export class DashboardNavbarComponent implements OnInit {
  userName: string = '';
  userAvatar: string = 'https://via.placeholder.com/32x32/667eea/ffffff?text=U';
  userRole: string | null = null;

  constructor(private authService: AuthService) { } // Inyectar AuthService

  ngOnInit(): void {
    this.loadUserInfo();
  }
  private loadUserInfo(): void {
    this.userRole = this.authService.getUserRole();
    const userId = this.authService.getUserId();

    if (userId) {
      this.authService.getUserDetails(userId).subscribe({
        next: (user) => {
          this.userName = `${user.nombre} ${user.apellido}`;
        },
        error: (err) => {
          console.log('Error al cargar información del usuario:', err);
          this.userName = 'Usuario';
        }
      });
    }
  }
  logout(): void {
    this.authService.logout();
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
