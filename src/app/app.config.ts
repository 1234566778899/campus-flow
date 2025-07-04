import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importar
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importar

import { routes } from './app.routes'; // Asegúrate de que esta ruta sea correcta
import { JwtInterceptor } from './interceptors/interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Mantener si lo necesitas para optimización de Zone.js
    provideRouter(routes),
    provideAnimations(), // Necesario para Angular Material
    // Configurar HttpClient con soporte para interceptores basados en DI
    provideHttpClient(withInterceptorsFromDi()),
    // Registrar tu JwtInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true, // Permite que haya múltiples interceptores en la aplicación
    },
    {
      provide: LOCALE_ID,
      useValue: 'es'
    }
  ]
};
