import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroEstudianteComponent } from './components/registro/registro-estudiante/registro-estudiante.component';
import { RegistroProfesorComponent } from './components/registro/registro-profesor/registro-profesor.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { RegistroSelectorComponent } from './components/registro/registro-selector/registro-selector.component';
import { IndexComponent } from './pages/index/index.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { EstudianteDashboardComponent } from './components/dashboard/estudiante-dashboard/estudiante-dashboard.component';
import { ProfesorDashboardComponent } from './components/dashboard/profesor-dashboard/profesor-dashboard.component';
import { ErrorDashboardComponent } from './components/dashboard/dasboard-error/dasboard-error.component';
import { EventoRegistrarComponent } from './components/evento/evento-registrar/evento-registrar.component';
import { EventoListarComponent } from './components/evento/evento-listar/evento-listar.component';
import { ForoListarComponent } from './components/foro/foro-listar/foro-listar.component';
import { HorarioListarComponent } from './components/horario/horario-listar/horario-listar.component';
import { NotaListarComponent } from './components/nota/nota-listar/nota-listar.component';
import { TareaListarComponent } from './components/tarea/tarea-listar/tarea-listar.component';
import { TareaRegistrarComponent } from './components/tarea/tarea-registrar/tarea-registrar.component';
import { PublicacionListarComponent } from './components/publicacion/publicacion-listar/publicacion-listar.component';
import { RecompensaRegistrarComponent } from './components/recompensa/recompensa-registrar/recompensa-registrar.component';
import { RecompensaListarComponent } from './components/recompensa/recompensa-listar/recompensa-listar.component';
import { RecursoRegistrarComponent } from './components/recurso/recurso-registrar/recurso-registrar.component';
import { RecursoListarComponent } from './components/recurso/recurso-listar/recurso-listar.component';
import { NotasAsignaturaComponent } from './components/notas-asignatura/notas-asignatura.component';
import { PublicacionRegistroComponent } from './components/publicacion/publicacion-registrar/publicacion-registrar.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ResumeProfesorComponent } from './components/resume-profesor/resume-profesor.component';

export const routes: Routes = [
  // Rutas públicas o de autenticación
  { path: '', redirectTo: '/index', pathMatch: 'full' }, // Redirección por defecto
  { path: 'index', component: IndexComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'marcas', component: MarcasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro-selector', component: RegistroSelectorComponent },
  { path: 'registrar-estudiante', component: RegistroEstudianteComponent },
  { path: 'registrar-profesor', component: RegistroProfesorComponent },
  { path: 'error-carga', component: ErrorDashboardComponent }, // Página de error genérica

  // Rutas de gestión (posiblemente para un rol de administrador o profesor, si no están en dashboard)
  // Si estas rutas son para el dashboard del profesor, se moverán dentro de 'dashboard-profesor'
  { path: 'asignaturas', component: AsignaturaComponent }, // Listar/Gestionar todas las asignaturas
  { path: 'estudiantes-gestion', component: EstudianteComponent }, // Listar/Gestionar todos los estudiantes
  { path: 'notas-gestion', component: NotaListarComponent }, // Listar/Gestionar todas las notas
  { path: 'eventos-registrar', component: EventoRegistrarComponent },
  { path: 'recompensas-registrar', component: RecompensaRegistrarComponent },
  { path: 'recursos-registrar', component: RecursoRegistrarComponent },
  { path: 'tareas-registrar', component: TareaRegistrarComponent },


  // Rutas del Dashboard del Estudiante (Protegidas)
  {
    path: 'dashboard-estudiante',
    component: EstudianteDashboardComponent,
    // canActivate: [AuthGuard], // Protege esta ruta y sus hijos
    data: { roles: ['ROLE_ESTUDIANTE'] }, // Define los roles permitidos para este dashboard
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirección por defecto dentro del dashboard
      { path: 'home', component: ResumeComponent },
      { path: 'horario', component: HorarioListarComponent },
      { path: 'notas', component: NotasAsignaturaComponent }, // Notas del estudiante
      { path: 'eventos', component: EventoListarComponent }, // Eventos para el estudiante
      { path: 'recompensas', component: RecompensaListarComponent }, // Recompensas del estudiante
      { path: 'tareas', component: TareaListarComponent }, // Tareas del estudiante
      { path: 'tareas', component: TareaListarComponent }, // Tareas del estudiante
      { path: 'tareas/nuevo', component: TareaRegistrarComponent }, // Horario del estudiante

      // Rutas anidadas para la sección de Foro
      {
        path: 'foro', // Ruta para el listado de grupos de foro
        children: [
          { path: '', component: ForoListarComponent }, // /dashboard-estudiante/foro
          { path: ':idGrupoForo/publicaciones', component: PublicacionListarComponent }, // /dashboard-estudiante/foro/123/publicaciones
          { path: ':idGrupoForo/publicaciones/registrar', component: PublicacionRegistroComponent }, // /dashboard-estudiante/foro/123/publicaciones/registrar
          { path: ':idPublicacion/recursos', component: RecursoListarComponent }, // /dashboard-estudiante/foro/123/publicaciones/456/recursos
          // Si necesitas registrar recursos para una publicación:
          // { path: ':idPublicacion/recursos/registrar', component: RecursoRegistrarComponent },
        ]
      },
    ]
  },

  // Rutas del Dashboard del Profesor (Protegidas)
  {
    path: 'dashboard-profesor',
    component: ProfesorDashboardComponent,
    //canActivate: [AuthGuard], // Protege esta ruta y sus hijos
    data: { roles: ['ROLE_PROFESOR'] }, // Define los roles permitidos
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ResumeProfesorComponent }, // Ejemplo: un componente home para el profesor
      // Aquí irían las rutas específicas del profesor:
      // { path: 'mis-asignaturas', component: ProfesorAsignaturasComponent },
      { path: 'eventos', component: EventoListarComponent },
      { path: 'gestionar-notas', component: NotaListarComponent }, // Gestionar todas las notas
      // etc.
    ]
  },

  // Ruta comodín para cualquier otra URL no reconocida
  { path: '**', redirectTo: '/index' },
];