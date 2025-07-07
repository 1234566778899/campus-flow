// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroEstudianteComponent } from './components/registro/registro-estudiante/registro-estudiante.component';
import { RegistroProfesorComponent } from './components/registro/registro-profesor/registro-profesor.component';
import { RegistroSelectorComponent } from './components/registro/registro-selector/registro-selector.component';
import { IndexComponent } from './pages/index/index.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { EstudianteDashboardComponent } from './components/dashboard/estudiante-dashboard/estudiante-dashboard.component';
import { ProfesorDashboardComponent } from './components/dashboard/profesor-dashboard/profesor-dashboard.component';
import { ErrorDashboardComponent } from './components/dashboard/dasboard-error/dasboard-error.component';

// Guards
import { AuthGuard, RoleGuard } from './guards/auth.guard';
import { ResumeComponent } from './components/resume/resume.component';
import { NotasAsignaturaComponent } from './components/notas-asignatura/notas-asignatura.component';
import { RecompensaListarComponent } from './components/recompensa/recompensa-listar/recompensa-listar.component';
import { TareaListarComponent } from './components/tarea/tarea-listar/tarea-listar.component';
import { HorarioListarComponent } from './components/horario/horario-listar/horario-listar.component';
import { EventoListarComponent } from './components/evento/evento-listar/evento-listar.component';
import { ForoListarComponent } from './components/foro/foro-listar/foro-listar.component';
import { ResumeProfesorComponent } from './components/resume-profesor/resume-profesor.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { NotaListarComponent } from './components/nota/nota-listar/nota-listar.component';
import { ProfesorEstudiantesComponent } from './components/profesor-estudiantes/profesor-estudiantes.component';
import { ProfesorNotasComponent } from './components/profesor-notas/profesor-notas.component';
import { ProfesorEventosComponent } from './components/profesor-eventos/profesor-eventos.component';
import { ProfesorRecompensasComponent } from './components/profesor-recompensas/profesor-recompensas.component';
import { ForoPrincipalComponent } from './components/foro-principal/foro-principal.component';
import { TareaRegistrarComponent } from './components/tarea/tarea-registrar/tarea-registrar.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';




export const routes: Routes = [
  // Rutas públicas
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'marcas', component: MarcasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro-selector', component: RegistroSelectorComponent },
  { path: 'registrar-estudiante', component: RegistroEstudianteComponent },
  { path: 'registrar-profesor', component: RegistroProfesorComponent },
  { path: 'error-carga', component: ErrorDashboardComponent },

  // Dashboard del Estudiante (Protegido)
  {
    path: 'dashboard-estudiante',
    component: EstudianteDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ESTUDIANTE'] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ResumeComponent },
      { path: 'notas', component: NotasAsignaturaComponent },
      { path: 'recompensas', component: RecompensaListarComponent },
      { path: 'tareas', component: TareaListarComponent },
      { path: 'tareas/nuevo', component: TareaRegistrarComponent },
      { path: 'horario', component: HorarioListarComponent },
      { path: 'eventos', component: EventoListarComponent },
      { path: 'foro', component: ForoListarComponent },
      { path: 'foro/:idGrupo', component: PublicacionesComponent }
    ]
  },

  // Dashboard del Profesor (Protegido)
  {
    path: 'dashboard-profesor',
    component: ProfesorDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_PROFESOR'] },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ResumeProfesorComponent },
      { path: 'estudiantes', component: ProfesorEstudiantesComponent },
      { path: 'notas', component: ProfesorNotasComponent },
      { path: 'eventos', component: ProfesorEventosComponent },
      { path: 'recompensas', component: ProfesorRecompensasComponent },
      { path: 'foro', component: ForoListarComponent },
      { path: 'foro/:idGrupo', component: PublicacionesComponent },
    ]
  },

  // Ruta comodín
  { path: '**', redirectTo: '/index' }
];